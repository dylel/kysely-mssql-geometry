import { Geometries } from "@turf/turf";
import { RawBuilder, sql } from "kysely";
import wkx from "wkx";

export function toGeom<T extends Geometries>(value: T): RawBuilder<T> {
  // parse geoJson
  const geom = wkx.Geometry.parseGeoJSON(value);
  const wkt = geom.toWkt();

  // @ts-ignore
  return sql`geometry::STGeomFromText(${wkt}, ${4326})` as string;
}
