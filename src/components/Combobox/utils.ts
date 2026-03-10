export const filterComboboxOptions = (options: string[], query: string): string[] => {
  if (query === "") {
    return options;
  }

  const normalizedQuery = query.toLowerCase();
  return options.filter((option) => option.toLowerCase().includes(normalizedQuery));
};
