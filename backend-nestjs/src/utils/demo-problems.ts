// src/utils/demo-problems.ts

export const DEMO_PROBLEMS = {
  sumTwoNumbers: {
    title: 'Sum of Two Numbers',
    functionSignatures: {
      63: 'function sumTwoNumbers(a, b) {',
      71: 'def sum_two_numbers(a, b):',
      62: 'public static int sumTwoNumbers(int a, int b) {',
      54: 'int sumTwoNumbers(int a, int b) {',
      50: 'int sumTwoNumbers(int a, int b) {',
    },
    functionName: {
      63: 'sumTwoNumbers',
      71: 'sum_two_numbers',
      62: 'sumTwoNumbers',
      54: 'sumTwoNumbers',
      50: 'sumTwoNumbers',
    },
    sampleTests: [
      { input: '10 20', expectedOutput: '30\n' },
      { input: '5 15', expectedOutput: '20\n' },
    ],
    hiddenTests: [{ input: '100 200', expectedOutput: '300\n' }],
  },
};
