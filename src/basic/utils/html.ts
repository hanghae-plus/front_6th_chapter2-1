export function html(strings: TemplateStringsArray, ...expressions: unknown[]) {
  const result = [];

  for (let i = 0; i < strings.length; i++) {
    result.push(strings[i]);

    if (i < expressions.length) {
      const value = expressions[i];
      result.push(Array.isArray(value) ? value.join('') : value);
    }
  }

  return result.join('');
}
