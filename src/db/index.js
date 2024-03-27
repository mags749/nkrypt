import { Database } from "@nozbe/watermelondb";
import SQLiteAdapater from "@nozbe/watermelondb/adapters/sqlite";

import schema from "./schema";

const adapter = new SQLiteAdapater({
  schema,
  dbName: "nkrypt",
  onSetUpError: (error) => console.error(error),
});

const db = new Database({
  adapter,
  modelClasses: [],
});

export default db;
