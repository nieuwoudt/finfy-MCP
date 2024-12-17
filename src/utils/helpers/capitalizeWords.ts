function capitalizeWords(str: string) {
    return str.replace(/\b\w/g, (char: string) => char.toUpperCase());
  }

export { capitalizeWords }