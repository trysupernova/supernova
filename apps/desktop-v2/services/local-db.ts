import Database from "tauri-plugin-sql-api";
import { ISupernovaTask } from "../types/supernova-task";

export namespace LocalDB {
  // delete the table supernova_tasks if it exists
  // and then create it again
  const createSupernovaTasksTableQuery = `
    CREATE TABLE IF NOT EXISTS supernova_tasks (
      id TEXT PRIMARY KEY,
      originalBuildText TEXT,
      title TEXT,
      description TEXT,
      expectedDurationSeconds INTEGER,
      isComplete BOOLEAN,
      startTime TEXT
    )
  `;

  export async function init(): Promise<Database> {
    const db = await Database.load("sqlite:supernova.db");
    return db;
  }

  const convertISOStringToDate = (
    dateString: string | undefined
  ): Date | undefined => {
    if (!dateString) {
      return undefined;
    }
    return new Date(dateString);
  };

  const convertDateToISOString = (
    date: Date | undefined
  ): string | undefined => {
    if (!date) {
      return undefined;
    }
    return date.toISOString();
  };

  export const createTables = async (db: Database) => {
    await db.execute(createSupernovaTasksTableQuery);
  };

  export const insertTask = async (db: Database, task: ISupernovaTask) => {
    console.log(task);

    await db.execute(
      `
        INSERT INTO supernova_tasks (id, originalBuildText, title, description, expectedDurationSeconds, isComplete, startTime)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        task.id,
        task.originalBuildText,
        task.title,
        task.description,
        task.expectedDurationSeconds,
        task.isComplete,
        convertDateToISOString(task.startTime),
      ]
    );
  };

  export const updateTask = async (db: Database, task: ISupernovaTask) => {
    await db.execute(
      `
        UPDATE supernova_tasks
        SET title = ?, originalBuildText = ?, description = ?, expectedDurationSeconds = ?, isComplete = ?, startTime = ?
        WHERE id = ?
      `,
      [
        task.title,
        task.originalBuildText,
        task.description,
        task.expectedDurationSeconds,
        task.isComplete,
        convertDateToISOString(task.startTime),
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
        SELECT id, title, originalBuildText, description, expectedDurationSeconds, isComplete, startTime
        FROM supernova_tasks
      `
    );
    // get the rows and convert them to ISupernovaTask[]
    return (result as any[])
      .map((row) => {
        return {
          id: row.id,
          title: row.title,
          originalBuildText: row.originalBuildText,
          description: row.description === null ? undefined : row.description,
          expectedDurationSeconds: Number.isNaN(
            Number.parseInt(row.expectedDurationSeconds)
          )
            ? undefined
            : Number.parseInt(row.expectedDurationSeconds),
          isComplete: row.isComplete === "true",
          startTime:
            row.startTime === null
              ? undefined
              : convertISOStringToDate(row.startTime),
        };
      })
      .sort((a, b) => {
        // sorted by startTime (earliest first)
        // completed tasks are at the bottom
        if (a.isComplete && !b.isComplete) {
          return 1;
        } else if (!a.isComplete && b.isComplete) {
          return -1;
        } else if (a.startTime && b.startTime) {
          return a.startTime.getTime() - b.startTime.getTime();
        } else {
          return 0;
        }
      });
  };
}
