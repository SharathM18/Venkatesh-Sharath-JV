interface WrapOptions {
  language: string;
  userCode: string;
  signature: string;
  functionName: string;
  testCases: { input: string }[];
}

// ✅ Extract parameter types from function signature
function extractParams(signature: string): { type: string; name: string }[] {
  const start = signature.indexOf('(');
  const end = signature.indexOf(')');
  if (start === -1 || end === -1 || start > end) return [];
  const paramStr = signature.slice(start + 1, end).trim();
  if (!paramStr) return [];

  return paramStr
    .split(',')
    .map((param) => {
      const cleaned = param.trim();
      const match = cleaned.match(/^(.+?)\s+(\w+)$/);

      if (match) {
        let [, type, name] = match;
        type = type.replace(/\s+/g, ''); // Remove any spaces in type like "int []"

        // Normalize types with a clear priority
        if (
          type.includes('int[][]') ||
          type.includes('int**') ||
          type.includes('vector<vector<int>>')
        ) {
          type = 'int[][]';
        } else if (type.includes('int[]') || type.includes('vector<int>')) {
          type = 'int[]';
        } else if (
          type.includes('string[][]') ||
          type.includes('vector<vector<string>>')
        ) {
          type = 'string[][]';
        } else if (
          type.includes('string[]') ||
          type.includes('vector<string>')
        ) {
          type = 'string[]';
        } else if (type.includes('int')) {
          type = 'int';
        } else if (type.includes('float') || type.includes('double')) {
          type = 'float';
        } else if (type.includes('bool') || type.includes('boolean')) {
          type = 'bool';
        } else if (type.includes('string') || type.includes('String')) {
          type = 'string';
        }
        return { type, name };
      }

      // Fallback for types not explicitly declared (e.g., just "nums" as a param)
      if (/^\w+$/.test(cleaned)) {
        const name = cleaned;
        if (/matrix|grid|data/i.test(name)) return { type: 'int[][]', name };
        if (/nums|arr|list/i.test(name)) return { type: 'int[]', name };
        if (/words|strings/i.test(name)) return { type: 'string[]', name };
        return { type: 'int', name }; // Default scalar type
      }
      return { type: 'unknown', name: 'param' };
    })
    .filter((p) => p.name);
}

// ✅ Python indentation helper
function indentPython(code: string, spaces = 4): string {
  return code
    .split('\n')
    .map((line) => ' '.repeat(spaces) + line)
    .join('\n');
}

// ✅ Main Wrapper Function
export function wrapUserCode({
  language,
  userCode,
  signature,
  functionName,
  testCases,
}: WrapOptions): string {
  const params = extractParams(signature);
  const argsStr = params.map((p) => p.name).join(', ');
  // console.log(">> Params:", params);

  switch (language.toLowerCase()) {
    case 'python': {
      function extractParamsforPython(
        signature: string,
      ): { name: string; type: string }[] {
        const start = signature.indexOf('(');
        const end = signature.indexOf(')');
        if (start === -1 || end === -1 || start > end) return [];

        const paramStr = signature.slice(start + 1, end).trim();
        if (!paramStr) return [];

        return paramStr.split(',').map((param) => {
          const [name, type] = param.split(':').map((s) => s.trim());
          return {
            name: name || 'param',
            type: type || 'unknown',
          };
        });
      }
      const paramsforPython = extractParamsforPython(signature);
      const paramNames = paramsforPython.map((p) => p.name).join(', ');
      console.log('>> paramNames:', paramNames);
      console.log('>> Params:', params);
      // Indent user code properly
      const indentPython = (code: string) =>
        code
          .split('\n')
          .map((line) => '    ' + line)
          .join('\n');

      const fullFunction = userCode;

      const pyInputParser = (() => {
        let parser = '    flat = re.split(r"[\\s,]+", lines[0].strip())\n';
        let idx = 0;

        for (const { type, name } of paramsforPython) {
          if (type === 'int') {
            parser += `    ${name} = int(flat[${idx}])\n`;
            idx++;
          } else if (type === 'float' || type === 'double') {
            parser += `    ${name} = float(flat[${idx}])\n`;
            idx++;
          } else if (type === 'bool') {
            parser += `    ${name} = flat[${idx}].lower() in ('true', '1')\n`;
            idx++;
          } else if (type === 'string' || type === 'str' || type === 'String') {
            parser += `    ${name} = lines[${idx}].strip()\n`;
            idx++;
          } else if (type === 'int[]') {
            parser += `    ${name} = list(map(int, re.split(r"[\\s,]+", lines[${idx}].strip())))\n`;
            idx++;
          } else if (type === 'float[]' || type === 'double[]') {
            parser += `    ${name} = list(map(float, re.split(r"[\\s,]+", lines[${idx}].strip())))\n`;
            idx++;
          } else if (type === 'bool[]') {
            parser += `    ${name} = [x.lower() in ('true','1') for x in re.split(r"[\\s,]+", lines[${idx}].strip())]\n`;
            idx++;
          } else if (type === 'string[]') {
            parser += `    ${name} = re.split(r"[\\s,]+", lines[${idx}].strip())\n`;
            idx++;
          } else if (type === 'int[][]') {
            parser += `    ${name} = [list(map(int, re.split(r"[\\s,]+", row.strip()))) for row in lines[${idx}].strip().split(';') if row.strip()]\n`;
            idx++;
          } else if (type === 'float[][]' || type === 'double[][]') {
            parser += `    ${name} = [list(map(float, re.split(r"[\\s,]+", row.strip()))) for row in lines[${idx}].strip().split(';') if row.strip()]\n`;
            idx++;
          } else if (type === 'bool[][]') {
            parser += `    ${name} = [[x.lower() in ('true','1') for x in re.split(r"[\\s,]+", row.strip())] for row in lines[${idx}].strip().split(';') if row.strip()]\n`;
            idx++;
          } else if (type === 'string[][]') {
            parser += `    ${name} = [re.split(r"[\\s,]+", row.strip()) for row in lines[${idx}].strip().split(';') if row.strip()]\n`;
            idx++;
          } else if (type === 'list[list[int]]' || type === 'int[][]') {
            parser += `    ${name} = [list(map(int, re.split(r"[\\s,]+", row.strip()))) for row in lines[${idx}].strip().split(';') if row.strip()]\n`;
            idx++;
          } else if (type.toLowerCase().startsWith('list[')) {
            const innerType = type.slice(5, -1).trim();
            if (innerType === 'int') {
              parser += `    ${name} = list(map(int, re.split(r"[\\s,]+", lines[${idx++}].strip())))\n`;
            } else if (innerType === 'float' || innerType === 'double') {
              parser += `    ${name} = list(map(float, re.split(r"[\\s,]+", lines[${idx++}].strip())))\n`;
            } else if (innerType === 'bool') {
              parser += `    ${name} = [x.lower() in ('true','1') for x in re.split(r"[\\s,]+", lines[${idx++}].strip())]\n`;
            } else if (innerType === 'char') {
              parser += `    ${name} = [x[0] for x in re.split(r"[\\s,]+", lines[${idx++}].strip()) if x]\n`;
            } else {
              parser += `    ${name} = re.split(r"[\\s,]+", lines[${idx++}].strip())\n`; // default string
            }
          } else if (type.startsWith('tuple[')) {
            const innerTypes = type
              .slice(6, -1)
              .split(',')
              .map((t) => t.trim());
            const lineRef = `re.split(r"[\\s,]+", lines[${idx++}].strip())`;
            const tupleParts = innerTypes.map((t, i) => {
              if (t === 'int') return `int(${lineRef}[${i}])`;
              if (t === 'float' || t === 'double')
                return `float(${lineRef}[${i}])`;
              if (t === 'bool')
                return `${lineRef}[${i}].lower() in ('true','1')`;
              if (t === 'char')
                return `${lineRef}[${i}][0] if ${lineRef}[${i}] else ''`;
              return `${lineRef}[${i}]`; // string fallback
            });
            parser += `    ${name} = (${tupleParts.join(', ')})\n`;
          } else if (type.startsWith('set[')) {
            const innerType = type.slice(4, -1).trim();
            if (innerType === 'int') {
              parser += `    ${name} = set(map(int, re.split(r"[\\s,]+", lines[${idx++}].strip())))\n`;
            } else if (innerType === 'float' || innerType === 'double') {
              parser += `    ${name} = set(map(float, re.split(r"[\\s,]+", lines[${idx++}].strip())))\n`;
            } else if (innerType === 'bool') {
              parser += `    ${name} = set(x.lower() in ('true','1') for x in re.split(r"[\\s,]+", lines[${idx++}].strip()))\n`;
            } else if (innerType === 'char') {
              parser += `    ${name} = set(x[0] for x in re.split(r"[\\s,]+", lines[${idx++}].strip()) if x)\n`;
            } else {
              parser += `    ${name} = set(re.split(r"[\\s,]+", lines[${idx++}].strip()))\n`; // default string
            }
          } else if (type.startsWith('dict[') || type.startsWith('map[')) {
            const content = type.slice(type.indexOf('[') + 1, -1).split(',');
            const keyType = content[0]?.trim();
            const valueType = content[1]?.trim();

            const keyCast =
              keyType === 'int'
                ? 'int'
                : keyType === 'float' || keyType === 'double'
                  ? 'float'
                  : keyType === 'bool'
                    ? `(lambda x: x.lower() in ('true','1'))`
                    : keyType === 'char'
                      ? '(lambda x: x[0])'
                      : 'str';

            const valCast =
              valueType === 'int'
                ? 'int'
                : valueType === 'float' || valueType === 'double'
                  ? 'float'
                  : valueType === 'bool'
                    ? `(lambda x: x.lower() in ('true','1'))`
                    : valueType === 'char'
                      ? '(lambda x: x[0])'
                      : 'str';

            parser += `    ${name} = dict((${keyCast}(k), ${valCast}(v)) for k,v in [item.split(':') for item in lines[${idx++}].strip().split(',') if ':' in item])\n`;
          } else {
            parser += `    # Unsupported type for ${name}\n`;
          }
        }

        return parser;
      })();

      return `
import re
import sys

${fullFunction}

if __name__ == "__main__":
    lines = sys.stdin.read().strip().split("\\n")
${pyInputParser}
    print(${functionName}(${paramNames}))
  `.trim();
    }

    case 'javascript': {
      function stripTypes(signature: string): string {
        return signature
          .replace(/:\s*\w+/g, '') // remove TypeScript-style `: type`
          .replace(/<.*?>/g, ''); // remove generics like <T>
      }

      function extractParamsFromSignature(
        signature: string,
      ): { name: string; type: string }[] {
        const start = signature.indexOf('(');
        const end = signature.indexOf(')');
        if (start === -1 || end === -1 || start > end) return [];

        const paramStr = signature.slice(start + 1, end).trim();
        if (!paramStr) return [];

        return paramStr.split(',').map((param) => {
          const match = param.match(/(\w+)\s*(?:\/\*\s*(\w+)\s*\*\/)?/);
          if (!match) return { name: param.trim(), type: 'string' };
          const [, name, typeRaw] = match;
          const type = typeRaw?.toLowerCase() || 'string';
          return { name, type };
        });
      }

      const jsCompatibleSignature = stripTypes(signature);
      const params = extractParamsFromSignature(signature);
      const paramNames = params.map((p) => p.name).join(', ');

      const jsInputParser = (() => {
        const lineSplitCode = `const values = line.trim().split(/\\s+/);`;
        let index = 0;
        const extractors = params.map(({ name, type }) => {
          if (type === 'int')
            return `const ${name} = parseInt(values[${index++}]);`;
          if (type === 'float' || type === 'double')
            return `const ${name} = parseFloat(values[${index++}]);`;
          if (type === 'bool' || type === 'boolean')
            return `const ${name} = values[${index++}].toLowerCase() === 'true';`;
          if (type === 'string') return `const ${name} = line.trim();`;
          if (type === 'int[]')
            return `const ${name} = line.trim().split(/\\s+/).map(Number);`;
          if (type === 'float[]' || type === 'double[]')
            return `const ${name} = line.trim().split(/\\s+/).map(parseFloat);`;
          if (type === 'string[]')
            return `const ${name} = line.trim().split(/\\s+/);`;
          if (type === 'int[][]')
            return `const ${name} = line.trim().split(';').map(row => row.split(/\\s+|,/).map(Number));`;
          if (type === 'string[][]')
            return `const ${name} = line.trim().split(';').map(row => row.split(/\\s+|,/));`;
          return `// Unsupported type for ${name}`;
        });
        return [lineSplitCode, ...extractors].join('\n    ');
      })();

      const functionName =
        jsCompatibleSignature.match(
          /function\s+([a-zA-Z_$][a-zA-Z_$0-9]*)/,
        )?.[1] || 'func';

      return `
// ${jsCompatibleSignature}
${userCode}
// }

let input = '';
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  const lines = input.trim().split(/\\r?\\n/).filter(Boolean);
  lines.forEach(line => {
    ${jsInputParser}
    console.log(${functionName}(${paramNames}));
  });
});
`.trim();
    }

    case 'java': {
      const javaInput = params
        .map(({ type, name }) => {
          const uniqueNameSuffix = name.charAt(0).toUpperCase() + name.slice(1);

          if (type === 'int')
            return `int ${name} = Integer.parseInt(sc.nextLine().trim());`;
          if (type === 'String' || type == 'string')
            return `String ${name} = sc.nextLine().trim();`;
          if (type === 'int[]')
            return `
String line${uniqueNameSuffix};
do {
    line${uniqueNameSuffix} = sc.nextLine().trim();
} while (line${uniqueNameSuffix}.isEmpty());
int[] ${name} = Arrays.stream(line${uniqueNameSuffix}.split("[,\\s]+")).mapToInt(Integer::parseInt).toArray();`.trim();
          if (type === 'String[]')
            return `
String line${uniqueNameSuffix};
do {
    line${uniqueNameSuffix} = sc.nextLine().trim();
} while (line${uniqueNameSuffix}.isEmpty());
String[] ${name} = line${uniqueNameSuffix}.split("[,\\s]+");`.trim();
          if (type === 'int[][]')
            return `
String matrixLine${uniqueNameSuffix};
do {
    matrixLine${uniqueNameSuffix} = sc.nextLine().trim(); // This reads the entire matrix string like "1,2;3,4"
} while (matrixLine${uniqueNameSuffix}.isEmpty());
String[] rows${uniqueNameSuffix} = matrixLine${uniqueNameSuffix}.split(";");
int[][] ${name} = new int[rows${uniqueNameSuffix}.length][];
for (int i = 0; i < rows${uniqueNameSuffix}.length; i++) {
    String[] elements = rows${uniqueNameSuffix}[i].split("[,\\s]+");
    ${name}[i] = new int[elements.length];
    for (int j = 0; j < elements.length; j++) {
        ${name}[i][j] = Integer.parseInt(elements[j]);
    }
}`.trim();
          if (type === 'String[][]')
            return `
String matrixLine${uniqueNameSuffix};
do {
    matrixLine${uniqueNameSuffix} = sc.nextLine().trim();
} while (matrixLine${uniqueNameSuffix}.isEmpty());
String[] rows${uniqueNameSuffix} = matrixLine${uniqueNameSuffix}.split(";");
String[][] ${name} = new String[rows${uniqueNameSuffix}.length][];
for (int i = 0; i < rows${uniqueNameSuffix}.length; i++) {
    String[] elements = rows${uniqueNameSuffix}[i].split("[,\\s]+");
    ${name}[i] = elements;
}`.trim();
          return `// Unsupported type for ${name}`;
        })
        .join('\n'); // Changed join to just '\n' for clearer separation

      return `
import java.util.*;
import java.util.stream.*;

public class Main {
    // ${signature}
${userCode}

    // }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        ${javaInput}
        sc.close();

        System.out.println(${functionName}(${argsStr}));
    }
}
            `.trim();
    }

    case 'csharp': {
      const extractReturnTypeFromSignature = (signature: string): string => {
        const match = signature.match(
          /public\s+static\s+([^\s]+)\s+[^\s]+\s*\(/,
        );
        return match ? match[1] : 'object';
      };

      const returnType = extractReturnTypeFromSignature(signature);
      const argsStr = params.map((p) => p.name).join(', ');

      const csharpInput = params
        .map(({ type, name }) => {
          const uniqueSuffix = name.charAt(0).toUpperCase() + name.slice(1);

          if (type === 'int')
            return `int ${name} = int.Parse(Console.ReadLine().Trim());`;
          if (type === 'double' || type === 'float')
            return `double ${name} = double.Parse(Console.ReadLine().Trim());`;
          if (type === 'boolean')
            return `bool ${name} = bool.Parse(Console.ReadLine().Trim());`;
          if (type === 'string')
            return `string ${name} = Console.ReadLine().Trim();`;

          if (type === 'int[]')
            return `
string line${uniqueSuffix};
do {
    line${uniqueSuffix} = Console.ReadLine()?.Trim();
} while (string.IsNullOrEmpty(line${uniqueSuffix}));
int[] ${name} = line${uniqueSuffix}
    .Trim('[', ']')
    .Split(new[]{',',' '}, StringSplitOptions.RemoveEmptyEntries)
    .Select(int.Parse)
    .ToArray();`.trim();

          if (type === 'double[]' || type === 'float[]')
            return `
string line${uniqueSuffix};
do {
    line${uniqueSuffix} = Console.ReadLine()?.Trim();
} while (string.IsNullOrEmpty(line${uniqueSuffix}));
double[] ${name} = line${uniqueSuffix}
    .Trim('[', ']')
    .Split(new[]{',',' '}, StringSplitOptions.RemoveEmptyEntries)
    .Select(double.Parse)
    .ToArray();`.trim();

          if (type === 'string[]')
            return `
string line${uniqueSuffix};
do {
    line${uniqueSuffix} = Console.ReadLine()?.Trim();
} while (string.IsNullOrEmpty(line${uniqueSuffix}));
string[] ${name} = line${uniqueSuffix}
    .Trim('[', ']')
    .Split(new[]{',',' '}, StringSplitOptions.RemoveEmptyEntries);`.trim();

          if (type === 'int[][]')
            return `
string matrixLine${uniqueSuffix};
do {
    matrixLine${uniqueSuffix} = Console.ReadLine()?.Trim();
} while (string.IsNullOrEmpty(matrixLine${uniqueSuffix}));
string[] rows${uniqueSuffix} = matrixLine${uniqueSuffix}.Split(';');
int[][] ${name} = rows${uniqueSuffix}
    .Select(row => row
        .Trim('[', ']')
        .Split(new[]{',',' '}, StringSplitOptions.RemoveEmptyEntries)
        .Select(int.Parse)
        .ToArray())
    .ToArray();`.trim();

          if (type === 'string[][]')
            return `
string matrixLine${uniqueSuffix};
do {
    matrixLine${uniqueSuffix} = Console.ReadLine()?.Trim();
} while (string.IsNullOrEmpty(matrixLine${uniqueSuffix}));
string[] rows${uniqueSuffix} = matrixLine${uniqueSuffix}.Split(';');
string[][] ${name} = rows${uniqueSuffix}
    .Select(row => row
        .Trim('[', ']')
        .Split(new[]{',',' '}, StringSplitOptions.RemoveEmptyEntries))
    .ToArray();`.trim();

          return `// Unsupported type for ${name}`;
        })
        .join('\n        ');

      return `
using System;
using System.Linq;

public class MainClass {
    // ${signature}
    // {
        ${userCode}
    // }

    public static void Main(string[] args) {
        ${csharpInput}

        var result = ${functionName}(${argsStr});
        Console.WriteLine(result);
    }
}
  `.trim();
    }

    case 'c': {
      return `
#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>

${signature}
${userCode}
}

int main() {
    int *nums = NULL;
    int size = 0, capacity = 10;
    nums = malloc(capacity * sizeof(int));
    if (!nums) return 1;

    int num;
    char c;
    while (scanf("%d", &num) == 1) {
        if (size == capacity) {
            capacity *= 2;
            int *temp = realloc(nums, capacity * sizeof(int));
            if (!temp) {
                free(nums);
                return 1;
            }
            nums = temp;
        }
        nums[size++] = num;

        // Check if next character ends input
        c = getchar();
        if (c == '\\n' || c == EOF) break;
    }

    // Call function and print result
    int result = ${functionName}(nums, size);
    printf("%d\\n", result);

    free(nums);
    return 0;
}
  `.trim();
    }

    case 'cpp': {
      const decl = params
        .map((p) => {
          if (p.type === 'int') return `int ${p.name};`;
          if (p.type === 'string') return `string ${p.name};`;
          if (['int[]', 'vector<int>', 'vector<int>&'].includes(p.type))
            return `vector<int> ${p.name};`;
          if (
            ['string[]', 'vector<string>', 'vector<string>&'].includes(p.type)
          )
            return `vector<string> ${p.name};`;
          if (
            ['int[][]', 'vector<vector<int>>', 'vector<vector<int>>&'].includes(
              p.type,
            )
          )
            return `vector<vector<int>> ${p.name};`;
          if (
            [
              'string[][]',
              'vector<vector<string>>',
              'vector<vector<string>>&',
            ].includes(p.type)
          )
            return `vector<vector<string>> ${p.name};`;
          return `// Unsupported type for ${p.name}`;
        })
        .join('\n  ');
      const input = params
        .map((p) => {
          if (p.type === 'int' || p.type === 'string')
            return `cin >> ${p.name};`;
          if (p.type === 'int[]' || p.type === 'string[]')
            return `{
    string temp;
    getline(cin >> ws, temp);
    stringstream ss(temp);
    string val;
    while (getline(ss, val, ' ')) {
        stringstream item(val);
        string num;
        while (getline(item, num, ',')) {
            if (!num.empty()) ${p.name}.push_back(stoi(num));
        }
    }
}`;
          if (p.type === 'int[][]' || p.type === 'string[][]')
            return `{
    string line_str;
    getline(cin >> ws, line_str);
    stringstream ss_rows(line_str);
    string row_str;
    while (getline(ss_rows, row_str, ';')) {
        vector<int> row_vec;
        stringstream ss_elements(row_str);
        string element_str;
        while (getline(ss_elements, element_str, ',')) {
            if (!element_str.empty()) {
                row_vec.push_back(stoi(element_str));
            }
        }
        ${p.name}.push_back(row_vec);
    }
}`;
          return `// Unsupported input type for ${p.name}`;
        })
        .join('\n  ');
      return `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>

using namespace std;

${signature}
${userCode}
}

int main() {
  ${decl}
  ${input}
  cout << ${functionName}(${argsStr}) << endl;
  return 0;
}
            `.trim();
    }

    default:
      return userCode;
  }
}
