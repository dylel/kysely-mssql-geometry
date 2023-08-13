import { describe, it, expect } from "vitest";
import { sqlGeometryToGeoJSON } from "../geometry-handler/geometry-handler-plugin";
import { SqlGeometry } from "../geometry-handler/udt";

const testMultiPolygon: SqlGeometry = {
  srid: 4326,
  version: 1,
  points: [
    {
      x: 147.30101013306916,
      y: -19.600471687304708,
      z: null,
      m: null,
    },
    {
      x: 147.30433595232896,
      y: -19.57473342136515,
      z: null,
      m: null,
    },
    {
      x: 147.3323678575186,
      y: -19.578090819778456,
      z: null,
      m: null,
    },
    {
      x: 147.31858946344232,
      y: -19.607185340725536,
      z: null,
      m: null,
    },
    {
      x: 147.30101013306916,
      y: -19.600471687304708,
      z: null,
      m: null,
    },
    {
      x: 147.32951715529592,
      y: -19.607185340725536,
      z: null,
      m: null,
    },
    {
      x: 147.33474344270414,
      y: -19.585253035864824,
      z: null,
      m: null,
    },
    {
      x: 147.36158755530104,
      y: -19.591295907928156,
      z: null,
      m: null,
    },
    {
      x: 147.34258287381653,
      y: -19.61300361369155,
      z: null,
      m: null,
    },
    {
      x: 147.32951715529592,
      y: -19.607185340725536,
      z: null,
      m: null,
    },
  ],
  figures: [
    {
      attribute: 2,
      pointOffset: 0,
    },
    {
      attribute: 2,
      pointOffset: 5,
    },
  ],
  shapes: [
    {
      parentOffset: -1,
      figureOffset: 0,
      type: 6,
    },
    {
      parentOffset: 0,
      figureOffset: 0,
      type: 3,
    },
    {
      parentOffset: 0,
      figureOffset: 1,
      type: 3,
    },
  ],
  segments: [],
};

const expectedMultiPolygonGeoJSON = {
  type: "MultiPolygon",
  coordinates: [
    [
      [
        [147.30101013306916, -19.600471687304708],
        [147.30433595232896, -19.574733421365149],
        [147.33236785751859, -19.578090819778456],
        [147.31858946344232, -19.607185340725536],
        [147.30101013306916, -19.600471687304708],
      ],
    ],
    [
      [
        [147.32951715529592, -19.607185340725536],
        [147.33474344270414, -19.585253035864824],
        [147.36158755530104, -19.591295907928156],
        [147.34258287381653, -19.61300361369155],
        [147.32951715529592, -19.607185340725536],
      ],
    ],
  ],
};

const testPolygon: SqlGeometry = {
  srid: 4326,
  version: 1,
  points: [
    {
      x: 147.243304,
      y: -19.663112,
      z: null,
      m: null,
    },
    {
      x: 147.253575,
      y: -19.664082,
      z: null,
      m: null,
    },
    {
      x: 147.248703,
      y: -19.658979,
      z: null,
      m: null,
    },
    {
      x: 147.244248,
      y: -19.653817,
      z: null,
      m: null,
    },
    {
      x: 147.243304,
      y: -19.663112,
      z: null,
      m: null,
    },
  ],
  figures: [
    {
      attribute: 2,
      pointOffset: 0,
    },
  ],
  shapes: [
    {
      parentOffset: -1,
      figureOffset: 0,
      type: 3,
    },
  ],
  segments: [],
};

const expectedPolygonGeoJSON = {
  type: "Polygon",
  coordinates: [
    [
      [147.243304, -19.663112],
      [147.253575, -19.664082],
      [147.248703, -19.658979],
      [147.244248, -19.653817],
      [147.243304, -19.663112],
    ],
  ],
};

const testGeometryCollection = {
  srid: 4326,
  version: 1,
  points: [
    {
      x: 147.244248,
      y: -19.653817,
      z: null,
      m: null,
    },
    {
      x: 147.243304,
      y: -19.663112,
      z: null,
      m: null,
    },
    {
      x: 147.30101013306916,
      y: -19.600471687304708,
      z: null,
      m: null,
    },
    {
      x: 147.30433595232896,
      y: -19.57473342136515,
      z: null,
      m: null,
    },
    {
      x: 147.3323678575186,
      y: -19.578090819778456,
      z: null,
      m: null,
    },
    {
      x: 147.31858946344232,
      y: -19.607185340725536,
      z: null,
      m: null,
    },
    {
      x: 147.30101013306916,
      y: -19.600471687304708,
      z: null,
      m: null,
    },
    {
      x: 147.32951715529592,
      y: -19.607185340725536,
      z: null,
      m: null,
    },
    {
      x: 147.33474344270414,
      y: -19.585253035864824,
      z: null,
      m: null,
    },
    {
      x: 147.36158755530104,
      y: -19.591295907928156,
      z: null,
      m: null,
    },
    {
      x: 147.34258287381653,
      y: -19.61300361369155,
      z: null,
      m: null,
    },
    {
      x: 147.32951715529592,
      y: -19.607185340725536,
      z: null,
      m: null,
    },
    {
      x: 147.243304,
      y: -19.663112,
      z: null,
      m: null,
    },
    {
      x: 147.253575,
      y: -19.664082,
      z: null,
      m: null,
    },
    {
      x: 147.248703,
      y: -19.658979,
      z: null,
      m: null,
    },
    {
      x: 147.244248,
      y: -19.653817,
      z: null,
      m: null,
    },
    {
      x: 147.243304,
      y: -19.663112,
      z: null,
      m: null,
    },
  ],
  figures: [
    {
      attribute: 1,
      pointOffset: 0,
    },
    {
      attribute: 2,
      pointOffset: 2,
    },
    {
      attribute: 2,
      pointOffset: 7,
    },
    {
      attribute: 2,
      pointOffset: 12,
    },
  ],
  shapes: [
    {
      parentOffset: -1,
      figureOffset: 0,
      type: 7, // geometry collection
    },
    {
      parentOffset: 0,
      figureOffset: 0,
      type: 2, // linestring
    },
    {
      parentOffset: 0,
      figureOffset: 1,
      type: 6, // multipolygon
    },
    {
      parentOffset: 2,
      figureOffset: 1,
      type: 3, // polygon
    },
    {
      parentOffset: 2,
      figureOffset: 2,
      type: 3, // polygon
    },
    {
      parentOffset: 0,
      figureOffset: 3,
      type: 3, // polygon
    },
  ],
  segments: [],
};

const expectedGeometryCollectionGeoJSON = {
  type: "GeometryCollection",
  geometries: [
    {
      type: "LineString",
      coordinates: [
        [147.244248, -19.653817],
        [147.243304, -19.663112],
      ],
    },
    {
      type: "MultiPolygon",
      coordinates: [
        [
          [
            [147.30101013306916, -19.600471687304708],
            [147.30433595232896, -19.574733421365149],
            [147.33236785751859, -19.578090819778456],
            [147.31858946344232, -19.607185340725536],
            [147.30101013306916, -19.600471687304708],
          ],
        ],
        [
          [
            [147.32951715529592, -19.607185340725536],
            [147.33474344270414, -19.585253035864824],
            [147.36158755530104, -19.591295907928156],
            [147.34258287381653, -19.61300361369155],
            [147.32951715529592, -19.607185340725536],
          ],
        ],
      ],
    },
    {
      type: "Polygon",
      coordinates: [
        [
          [147.243304, -19.663112],
          [147.253575, -19.664082],
          [147.248703, -19.658979],
          [147.244248, -19.653817],
          [147.243304, -19.663112],
        ],
      ],
    },
  ],
};

const testLineString = {
  srid: 4326,
  version: 1,
  points: [
    {
      x: 147.146682,
      y: -19.563172,
      z: null,
      m: null,
    },
    {
      x: 147.14596,
      y: -19.569183,
      z: null,
      m: null,
    },
  ],
  figures: [
    {
      attribute: 1,
      pointOffset: 0,
    },
  ],
  shapes: [
    {
      parentOffset: -1,
      figureOffset: 0,
      type: 2,
    },
  ],
  segments: [],
};

const expectedLineStringGeoJSON = {
  type: "LineString",
  coordinates: [
    [147.146682, -19.563172],
    [147.14596, -19.569183],
  ],
};

const testMultiLineString = {
  srid: 4326,
  version: 1,
  points: [
    {
      x: 0,
      y: 0,
      z: null,
      m: null,
    },
    {
      x: 1440,
      y: 900,
      z: null,
      m: null,
    },
    {
      x: 800,
      y: 600,
      z: null,
      m: null,
    },
    {
      x: 200,
      y: 400,
      z: null,
      m: null,
    },
  ],
  figures: [
    {
      attribute: 1,
      pointOffset: 0,
    },
    {
      attribute: 1,
      pointOffset: 2,
    },
  ],
  shapes: [
    {
      parentOffset: -1,
      figureOffset: 0,
      type: 5,
    },
    {
      parentOffset: 0,
      figureOffset: 0,
      type: 2,
    },
    {
      parentOffset: 0,
      figureOffset: 1,
      type: 2,
    },
  ],
  segments: [],
};

const expectedMultiLineStringGeoJSON = {
  type: "MultiLineString",
  coordinates: [
    [
      [0, 0],
      [1440, 900],
    ],
    [
      [800, 600],
      [200, 400],
    ],
  ],
};
describe("parse polygon", () => {
  it("should be true", () => {
    const geom = sqlGeometryToGeoJSON(testPolygon);
    expect(geom).toStrictEqual(expectedPolygonGeoJSON);
  });
});

describe("parse multipolygon", () => {
  it("should be true", () => {
    const geom = sqlGeometryToGeoJSON(testMultiPolygon);
    expect(geom).toStrictEqual(expectedMultiPolygonGeoJSON);
  });
});

describe("parse lineString", () => {
  it("should be true", () => {
    const geom = sqlGeometryToGeoJSON(testLineString);
    expect(geom).toStrictEqual(expectedLineStringGeoJSON);
  });
});

describe("parse multiLineString", () => {
  it("should be true", () => {
    const geom = sqlGeometryToGeoJSON(testMultiLineString);
    expect(geom).toStrictEqual(expectedMultiLineStringGeoJSON);
  });
});

describe("parse geometry collection", () => {
  it("should be true", () => {
    const geom = sqlGeometryToGeoJSON(testGeometryCollection);
    expect(geom).toStrictEqual(expectedGeometryCollectionGeoJSON);
  });
});
