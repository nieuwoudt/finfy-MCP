const extractDate = (dateString: string) => {
  return dateString.split("T")[0];
};

export { extractDate };
