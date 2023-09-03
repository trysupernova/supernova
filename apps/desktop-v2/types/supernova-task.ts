export interface ISupernovaTask {
  id: string;
  title: string;
  description?: string;
  expectedDurationSeconds?: number; // in seconds
  isComplete: boolean;
}
