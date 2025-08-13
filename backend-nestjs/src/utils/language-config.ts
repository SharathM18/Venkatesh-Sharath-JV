export const LANGUAGE_CONFIG = {
  python: {
    extension: '.py',
    image: 'python:3.10.4',
    command: (file) => `python ${file}`,
  },
  javascript: {
    extension: '.js',
    image: 'node:18.15.0',
    command: (file) => `node ${file}`,
  },
  c: {
    extension: '.c',
    image: 'gcc:13.2.0',
    command: (file) => `gcc ${file} -o /tmp/out && /tmp/out`,
  },
  cpp: {
    extension: '.cpp',
    image: 'gcc:13.2.0',
    command: (file) => `g++ ${file} -o /tmp/out && /tmp/out`,
  },
  java: {
    extension: '.java',
    image: 'openjdk:17',
    command: (_file) => `javac Main.java && java -cp /app Main`,
  },

  csharp: {
    extension: '.cs',
    image: 'mono',
    command: (file) =>
      `csc ${file} -out:/app/program.exe && mono /app/program.exe`,
  },
};
