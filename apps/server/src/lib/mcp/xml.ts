export const wrapInTag = (data: any, tag: string) => {
  return `<${tag}>\n${data}\n</${tag}>`;
};
