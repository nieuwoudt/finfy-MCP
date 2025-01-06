export function removeEmojis(str?: string): string | undefined {
  if (str === undefined) {
    return undefined;
  }
  return str.replace(
    /[\uD83C-\uDBFF\uDC00-\uDFFF]+|[\u2600-\u26FF\u2700-\u27BF]+/g,
    ""
  )
  .replace(/undefined/g, "");
}
