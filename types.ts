import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";
import { Geometries } from "@turf/turf";

export interface Database {
  test: TestTable;
}

export interface TestTable {
  id: Generated<number>;
  name: string;
  geom: Geometries;
}
export type Test = Selectable<TestTable>;
export type NewTest = Insertable<TestTable>;
export type TestUpdate = Updateable<TestTable>;
