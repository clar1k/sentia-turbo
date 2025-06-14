export const wrapInTag = (data: any, tag: string) => {
  return `<${tag}>` + `  ${data}` + `</${tag}>`;
};
