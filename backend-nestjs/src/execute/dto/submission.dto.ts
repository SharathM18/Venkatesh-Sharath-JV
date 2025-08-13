export class CreateSubmissionDto {
  applicantId: string;
  problemKey: string;
  // languageId: number;
  code: string;
  output: string;
  status: string; // "Accepted", "Wrong Answer", etc.
  testResults: any; // JSON array of test results
  isAutoSubmitted?: boolean;
}
