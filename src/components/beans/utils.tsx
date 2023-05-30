import { MapPinIcon, UsersIcon } from "@heroicons/react/20/solid";
import { Beans } from "../../types/beans";
import { DataListItem } from "../DataList";

export const areBeansFresh = (beans: Beans | null): boolean =>
  !beans?.freezeDate && !beans?.thawDate;

export const areBeansFrozen = (beans: Beans | null): boolean =>
  !!beans?.freezeDate && !beans?.thawDate;

export const areBeansThawed = (beans: Beans | null): boolean =>
  !!beans?.freezeDate && !!beans?.thawDate;

export const beansToDataListItem = (b: Beans): DataListItem =>
  b.origin === "single-origin"
    ? {
        link: `/beans/${b.id ?? ""}`,
        topRow: { title: b.name, pill: b.process ?? undefined },
        bottomRow: {
          date: b.roastDate?.toDate(),
          tags: [
            { icon: <UsersIcon />, label: b.roaster },
            ...(b.country ? [{ icon: <MapPinIcon />, label: b.country }] : []),
          ],
        },
      }
    : {
        link: `/beans/${b.id ?? ""}`,
        topRow: { title: b.name, pill: "Blend" },
        bottomRow: {
          date: b.roastDate?.toDate(),
          tags: [{ icon: <UsersIcon />, label: b.roaster }],
        },
      };
