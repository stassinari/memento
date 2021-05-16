// little utility to help with accessing dynamic object keys
// taken from here https://medium.com/@_achou/dont-give-up-and-use-suppressimplicitanyindexerrors-ca6b208b9365
export function keys<O extends object>(obj: O): Array<keyof O> {
  return Object.keys(obj) as Array<keyof O>;
}
