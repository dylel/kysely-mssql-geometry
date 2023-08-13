import { Kysely, MssqlDialect } from "kysely";
import * as Tedious from "tedious";
import * as Tarn from "tarn";
import { Database } from "./types";
import { ParseGeometryPlugin } from "./geometry-handler/geometry-handler-plugin";
import { toGeom } from "./helper";

const tediousConnection = new Tedious.Connection({
  authentication: {
    options: {
      password: "",
      userName: "",
    },
    type: "default",
  },
  options: {
    connectTimeout: 3000,
    database: "test-db",
    trustServerCertificate: true,
    useUTC: true,
    port: 1444,
  },
  server: "localhost",
});

const dialect = new MssqlDialect({
  connectionFactory: () => tediousConnection,
  Tarn: {
    options: {
      max: 20,
      min: 0,
    },
    ...Tarn,
  },
  Tedious,
});

const db = new Kysely<Database>({
  dialect: dialect,
  plugins: [new ParseGeometryPlugin()],
});

async function main() {
  console.log("running query");
  const results = await db
    .selectFrom("test")
    .select(["test.name", "test.geom"])
    .execute();

  console.log("results", JSON.stringify(results, null, 2));

  // test insert
  const insertResult = await db
    .insertInto("test")
    .values({
      name: "test",
      geom: toGeom({
        type: "Polygon",
        coordinates: [
          [
            [0, 0],
            [0, 1],
            [1, 1],
            [1, 0],
            [0, 0],
          ],
        ],
      }),
    })
    .execute();
  console.log("insertResult", insertResult);
}

main();
