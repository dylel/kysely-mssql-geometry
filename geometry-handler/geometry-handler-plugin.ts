import {
  KyselyPlugin,
  PluginTransformQueryArgs,
  PluginTransformResultArgs,
  QueryResult,
  RootOperationNode,
  UnknownRow,
} from "kysely";
import * as Parser from "./udt";
import { SqlGeometry, geometry } from "./udt";
import { Geometries, Position } from "@turf/turf";
import { MultiLineString, MultiPoint, MultiPolygon, Polygon } from "geojson";

export type DrainOuterGeneric<T> = [T] extends [unknown] ? T : never;

export type ShallowRecord<K extends keyof any, T> = DrainOuterGeneric<{
  [P in K]: T;
}>;

export function isObject(obj: unknown): obj is ShallowRecord<string, unknown> {
  return typeof obj === "object" && obj !== null;
}

export function isDate(obj: unknown): obj is Date {
  return obj instanceof Date;
}
export function isBuffer(obj: unknown): obj is { length: number } {
  return typeof Buffer !== "undefined" && Buffer.isBuffer(obj);
}

export function isArrayBufferOrView(
  obj: unknown
): obj is ArrayBuffer | ArrayBufferView {
  return obj instanceof ArrayBuffer || ArrayBuffer.isView(obj);
}

export function isPlainObject(obj: unknown): obj is Record<string, unknown> {
  return (
    isObject(obj) &&
    !Array.isArray(obj) &&
    !isDate(obj) &&
    !isBuffer(obj) &&
    !isArrayBufferOrView(obj)
  );
}

export class ParseGeometryPlugin implements KyselyPlugin {
  transformQuery(args: PluginTransformQueryArgs): RootOperationNode {
    return args.node;
  }

  async transformResult(
    args: PluginTransformResultArgs
  ): Promise<QueryResult<UnknownRow>> {
    return {
      ...args.result,
      rows: parseArray(args.result.rows),
    };
  }
}

function parseArray<T>(arr: T[]): T[] {
  for (let i = 0; i < arr.length; ++i) {
    arr[i] = parse(arr[i]) as T;
  }

  return arr;
}

function parse(obj: unknown): unknown {
  console.log("parse", obj);
  // check if object is a buffer
  if (Array.isArray(obj)) {
    return parseArray(obj);
  }

  if (isPlainObject(obj)) {
    return parseObject(obj);
  }

  if (isBuffer(obj)) {
    const buff = obj as Buffer;
    const geom = geometry(buff);
    return sqlGeometryToGeoJSON(geom);
  }

  return obj;
}

function parseObject(obj: Record<string, unknown>): Record<string, unknown> {
  for (const key in obj) {
    obj[key] = parse(obj[key]);
  }

  return obj;
}

export function sqlGeometryToGeoJSON(geometry: SqlGeometry | null) {
  if (geometry === null) {
    return null;
  }

  function parseParentShape(shape: SqlGeometry["shapes"][0], offset: number) {
    // these shapes require nesting into the parent itself
    const parentShape: MultiPolygon | MultiLineString | MultiPoint = {
      type: decodeType(shape.type) as
        | "MultiPoint"
        | "MultiLineString"
        | "MultiPolygon",
      coordinates: [],
    };

    const adjustedOffset = shape.parentOffset === -1 ? 0 : offset;

    // get all the figures for the current shape
    const shapeFigures = geometry?.shapes
      .filter((s) => s.parentOffset === adjustedOffset)
      .map((shape) => {
        return parseShape(
          shape.figureOffset,
          shape.type,
          geometry.figures,
          geometry.points
        );
      });

    // add the figures to the parent shape
    shapeFigures?.forEach((shapeFigure) => {
      //@ts-expect-error
      parentShape.coordinates.push(shapeFigure.coordinates);
    });

    // update the index
    return parentShape;
  }

  // use for loop to loop over all the shpaes
  const geometries: Geometries[] = [];

  const topLevelParent = geometry.shapes.find(
    (shape) => shape.parentOffset === -1
  );

  if (!topLevelParent) {
    return null;
  }

  if (
    topLevelParent.type === 1 ||
    topLevelParent.type === 2 ||
    topLevelParent.type === 3
  ) {
    return parseShape(
      topLevelParent.figureOffset,
      topLevelParent.type,
      geometry.figures,
      geometry.points
    );
  }

  if (
    topLevelParent.type === 4 ||
    topLevelParent.type === 5 ||
    topLevelParent.type === 6
  ) {
    const parent = parseParentShape(
      topLevelParent,
      topLevelParent.parentOffset
    );

    console.log("parent", JSON.stringify(parent, null, 2));

    return parent;
  }

  if (topLevelParent.type === 7) {
    const parentShape: Geometries = {
      //@ts-expect-error
      type: decodeType(topLevelParent.type),
      geometries: [],
    };

    // build all individual shapes and then at the end add them to the parent geometries

    const shapesT = geometry.shapes.filter((s) => s.parentOffset !== -1);

    for (let i = 0; i < shapesT.length; i) {
      const shape = shapesT[i];

      if (shape.type === 1 || shape.type === 2 || shape.type === 3) {
        const shapeFigure = parseShape(
          shape.figureOffset,
          shape.type,
          geometry.figures,
          geometry.points
        );

        //@ts-expect-error
        parentShape.geometries.push(shapeFigure);

        i++;
      }

      if (shape.type === 4 || shape.type === 5 || shape.type === 6) {
        const shapeFigure = parseParentShape(shape, i + 1);
        // get all the figures for the current shape
        const shapeFigures = geometry.shapes.filter(
          (s) => s.parentOffset === i + 1
        );

        //@ts-expect-error
        parentShape.geometries.push(shapeFigure);

        // move the index forward by the number of shapes for the parent
        i += shapeFigures.length + 1;
      }
    }

    return parentShape;
  }

  return geometries[0];
}

function decodeType(type: number) {
  switch (type) {
    case 1:
      return "Point";
    case 2:
      return "LineString";
    case 3:
      return "Polygon";
    case 4:
      return "MultiPoint";
    case 5:
      return "MultiLineString";
    case 6:
      return "MultiPolygon";
    case 7:
      return "GeometryCollection";
  }

  return "Unknown";
}

function parseFigure(
  indexStart: number,
  indexEnd: number,
  points: SqlGeometry["points"]
) {
  return points.slice(indexStart, indexEnd).map((point) => [point.x, point.y]);
}

function parseShape(
  figureOffset: number,
  type: number,
  figures: SqlGeometry["figures"],
  points: SqlGeometry["points"]
): {
  type: Geometries["type"];
  coordinates: Position | Position[] | Position[][];
} {
  const start = figures[figureOffset].pointOffset;
  const end = figures[figureOffset + 1]?.pointOffset ?? points.length;

  if (type === 3) {
    return {
      //@ts-expect-error
      type: decodeType(type),
      coordinates: [parseFigure(start, end, points)],
    };
  }

  return {
    //@ts-expect-error
    type: decodeType(type),
    coordinates: parseFigure(start, end, points),
  };
}
