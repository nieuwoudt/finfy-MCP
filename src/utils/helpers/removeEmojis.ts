export function removeEmojis(str: string) {
    return str.replace(
      /[\uD83C-\uDBFF\uDC00-\uDFFF]+|[\u2600-\u26FF\u2700-\u27BF]+/g,
      ""
    );
  }