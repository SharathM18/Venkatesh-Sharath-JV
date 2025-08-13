export function extractParams(
  signature: string,
): { type: string; name: string }[] {
  const start = signature.indexOf('(');
  const end = signature.indexOf(')');
  if (start === -1 || end === -1 || start > end) return [];

  const paramStr = signature.slice(start + 1, end).trim();
  if (!paramStr) return [];

  const typeMap: Record<string, string> = {
    'int[][]': 'int[][]',
    'int**': 'int[][]',
    'vector<vector<int>>': 'int[][]',
    'string[][]': 'string[][]',
    'vector<vector<string>>': 'string[][]',
    'int[]': 'int[]',
    'vector<int>': 'int[]',
    'string[]': 'string[]',
    'vector<string>': 'string[]',
    float: 'float',
    double: 'float',
    bool: 'bool',
    boolean: 'bool',
    int: 'int',
    string: 'string',
    String: 'string',
  };

  return paramStr
    .split(',')
    .map((param) => {
      const cleaned = param.trim().replace(/=.*/, ''); // Remove default values
      const match = cleaned.match(/^(.+?)\s+(\w+)$/);

      if (match) {
        let [, rawType, name] = match;
        rawType = rawType.replace(/\s+/g, '');
        let type = 'unknown';

        for (const [key, normalized] of Object.entries(typeMap)) {
          if (rawType.includes(key)) {
            type = normalized;
            break;
          }
        }

        return { type, name };
      }

      if (/^\w+$/.test(cleaned)) {
        const name = cleaned;
        if (/matrix|grid|data/i.test(name)) return { type: 'int[][]', name };
        if (/nums|arr|list/i.test(name)) return { type: 'int[]', name };
        if (/words|strings/i.test(name)) return { type: 'string[]', name };
        return { type: 'int', name };
      }

      return { type: 'unknown', name: 'param' };
    })
    .filter((p) => p.name);
}
