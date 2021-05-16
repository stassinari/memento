import { format, parseISO } from "date-fns";
import firebase from "firebase/app";

export const renderDate = (
  date: firebase.firestore.Timestamp | Date | null,
  formatStr = "dd MMM yyyy"
) => {
  if (!date) {
    return "";
  }
  let parsedDate;
  if (typeof date === "object") {
    // assuming this is Firebase's Timestamp
    // @ts-ignore
    parsedDate = date.toDate();
  } else {
    // TODO remove when work on conforming dates is done
    parsedDate = parseISO(date);
  }
  return format(parsedDate, formatStr);
};

export const toDate = (date: firebase.firestore.Timestamp | Date | null) => {
  if (typeof date === "object") {
    // @ts-ignore
    return date.toDate();
  }
  return date;
};
