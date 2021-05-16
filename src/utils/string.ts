export const capitalise = (s?: string | null) => {
  if (!s || typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const generateRandomString = (len: number = 16) =>
  Array(len)
    .fill(0)
    .map((x) => Math.random().toString(36).charAt(2))
    .join("");
