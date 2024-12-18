import {
  ANYONE_CAN,
  createSchema,
  createTableSchema,
  definePermissions,
  NOBODY_CAN,
  Row,
} from "@rocicorp/zero";

const cellSchema = createTableSchema({
  tableName: "cells",
  columns: {
    id: "string",
    color: "string",
    canvas_id: "string",
    x_position: "number",
    y_position: "number",
    inserted_at: "string",
    updated_at: "string",
  },
  primaryKey: ["id"],
});

export const schema = createSchema({
  version: 1,
  tables: {
    cells: cellSchema,
  },
});

export type Schema = typeof schema;
export type Cell = Row<typeof cellSchema>;

export const permissions = definePermissions(schema, () => ({
  cells: {
    row: {
      insert: ANYONE_CAN,
      update: ANYONE_CAN,
      delete: NOBODY_CAN,
      read: ANYONE_CAN,
    },
  },
}));
