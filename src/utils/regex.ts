export function getObjectFromStringResponse(res: string): string {
  const stringValueRegex = /\("(.+)" string\)/;
  const stringValueMatch = res.match(stringValueRegex);
  const stringValue = stringValueMatch ? stringValueMatch[1] : null;
  const response =
    stringValue !== null ? stringValue.replace(/\\"/g, '"') : null;
  return JSON.parse(response);
}
