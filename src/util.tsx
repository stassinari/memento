import { Beans } from "./types/beans";

export function isNotNullable<T>(x: T | null | undefined): x is T {
  return x != null;
}

export const isNotFrozenOrIsThawed = (beans: Beans): boolean =>
  !beans.freezeDate || (!!beans.freezeDate && !!beans.thawDate);
