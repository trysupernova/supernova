export interface ISupernovaTask {
  id: string;
  title: string;
  originalBuildText: string;
  description?: string;
  expectedDurationSeconds?: number; // in seconds
  startTime?: Date;
  isComplete: boolean;
}
