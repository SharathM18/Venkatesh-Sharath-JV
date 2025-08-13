export class RunCodeDto {
  language: 'python' | 'javascript' | 'c' | 'cpp' | 'java' | 'csharp';
  code: string;
  input?: string;
}
