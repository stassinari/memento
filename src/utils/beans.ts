import { toDate } from "./dates";
import { capitalise } from "./string";

export const areBeansFrozen = (beans: Beans): boolean =>
  !!beans.freezeDate && !beans.thawDate;

export const sortBeansByRoastDate = (a: Beans, b: Beans) =>
  a.roastDate && b.roastDate
    ? toDate(b.roastDate) - toDate(a.roastDate)
    : -b.name.localeCompare(a.name);

export const buildBeansIdLabelMap = (
  beansList: Beans[] | undefined,
  extended = false
) => {
  if (!beansList) {
    return {};
  }
  return beansList.reduce((obj: Record<string, string>, bean) => {
    if (bean.id) {
      obj[bean.id] = buildBeansLabel(bean, extended);
    }
    return obj;
  }, {});
};

export const buildBeansLabel = (
  beans: Beans | undefined,
  extended: boolean
) => {
  if (!beans) {
    return "";
  }

  let result = beans.name;
  if (extended) {
    result += ` (${beans.roaster})`;
  }

  return result;
};

export const buildBeansSecondaryLabel = (beans: Beans | undefined): string =>
  !beans
    ? ""
    : beans.origin === "single-origin"
    ? [beans.country, beans.process].filter((el) => !!el).join(", ")
    : `${capitalise(beans.roastStyle)} blend`;

export const filterBeans = (
  beansList: Beans[],
  excludeRoastStyle?: RoastStyle
): Beans[] =>
  beansList
    .filter((b) => {
      if (!b.roastStyle) return true; // only useful for non-migrated beans
      if (areBeansFrozen(b)) return false;

      return excludeRoastStyle ? b.roastStyle !== excludeRoastStyle : true;
    })
    .sort(sortBeansByRoastDate);
