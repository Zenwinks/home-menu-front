export function deepCopy(object: object): object {
  return JSON.parse(JSON.stringify(object));
}