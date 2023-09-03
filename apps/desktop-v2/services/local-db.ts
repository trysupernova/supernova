import Database from "tauri-plugin-sql-api";
import { ISupernovaTask } from "../types/supernova-task";

export namespace LocalDB {
  const createSupernovaTasksTableQuery = `
    CREATE TABLE IF NOT EXISTS supernova_tasks (
      id TEXT PRIMARY KEY,
      title TEXT,
      description TEXT,
      expectedDurationSeconds INTEGER,
      isComplete BOOLEAN
    )
  `;

  export async function init(): Promise<Database> {
    const db = await Database.load("sqlite:supernova.db");
    return db;
  }

  export const createTables = async (db: Database) => {
    await db.execute(createSupernovaTasksTableQuery);
  };

  export const insertTask = async (db: Database, task: ISupernovaTask) => {
    await db.execute(
      `
        INSERT INTO supernova_tasks (id, title, description, expectedDurationSeconds, isComplete)
        VALUES (?, ?, ?, ?, ?)
      `,
      [
        task.id,
        task.title,
        task.description,
        task.expectedDurationSeconds,
        task.isComplete,
      ]
    );
  };

  export const updateTask = async (db: Database, task: ISupernovaTask) => {
    await db.execute(
      `
        UPDATE supernova_tasks
        SET title = ?, description = ?, expectedDurationSeconds = ?, isComplete = ?
        WHERE id = ?
      `,
      [
        task.title,
        task.description,
        task.expectedDurationSeconds,
        task.isComplete,
        task.id,
      ]
    );
  };

  export const markIsCompleteTask = async (
    db: Database,
    taskId: string,
    isComplete: boolean
  ) => {
    await db.execute(
      `

        UPDATE supernova_tasks
        SET isComplete = ?
        WHERE id = ?
      `,
      [isComplete, taskId]
    );
  };

  export const deleteTask = async (db: Database, taskId: string) => {
    await db.execute(
      `
        DELETE FROM supernova_tasks
        WHERE id = ?
      `,
      [taskId]
    );
  };

  export const getTasks = async (db: Database): Promise<ISupernovaTask[]> => {
    const result = await db.select(
      `
        SELECT id, title, description, expectedDurationSeconds, isComplete
        FROM supernova_tasks
      `
    );
    return (result as any[]).map((row) => {
      return {
        id: row.id,
        title: row.title,
        description: row.description === null ? undefined : row.description,
        expectedDurationSeconds: Number.isNaN(
          Number.parseInt(row.expectedDurationSeconds)
        )
          ? undefined
          : Number.parseInt(row.expectedDurationSeconds),
        isComplete: row.isComplete === "true",
      };
    });
  };
}
