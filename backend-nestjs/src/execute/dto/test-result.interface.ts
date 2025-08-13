export interface TestResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  stderr: string;
}
