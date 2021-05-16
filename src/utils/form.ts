export const SUGGESTIONS_HISTORY_LIMIT = 50;

export const extractSortedArray = (list: any[], field: string) => {
  // create an object where keys are the value for the given field and
  // the value is the number of occurences:
  // {
  //   fieldValue1: numberOfOccurences
  //   fieldValue2: numberOfOccurences
  // }
  const occurencesObj = list.reduce((accumulator, brew) => {
    const fieldValue = brew[field];
    if (!fieldValue) {
      return accumulator;
    }
    accumulator[fieldValue] = accumulator[fieldValue]
      ? accumulator[fieldValue] + 1
      : 1;
    return accumulator;
  }, {});

  return (
    Object.keys(occurencesObj)
      // create an array from the object from before
      .map((key) => ({
        field: key,
        occurences: occurencesObj[key],
      }))
      // sorts it based on the number of occurences
      .sort((a, b) =>
        a.occurences > b.occurences ? -1 : b.occurences > a.occurences ? 1 : 0
      )
      .map((obj) => obj.field)
  );
};

export const extractSuggestions = (list: any[], field: string, limit = 3) => {
  if (!Array.isArray(list)) {
    return [];
  }

  // iterates to create a format read by the ChipsSuggestions component
  const result = extractSortedArray(list, field)
    .map((value, index) => ({
      key: index,
      label: value,
    }))
    .slice(0, limit);
  return result;
};

// ISO 3166-1 alpha-2
// ⚠️ No support for IE 11
export const countryToFlag = (isoCode: string) => {
  return typeof String.fromCodePoint !== "undefined"
    ? isoCode
        .toUpperCase()
        .replace(/./g, (char) =>
          String.fromCodePoint(char.charCodeAt(0) + 127397)
        )
    : isoCode;
};
