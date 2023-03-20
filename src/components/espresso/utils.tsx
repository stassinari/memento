import { MapPinIcon } from "@heroicons/react/20/solid";
import { Espresso } from "../../types/espresso";
import { DataListItem } from "../DataList";

export const espressoToDataListItem = (e: Espresso): DataListItem => ({
  link: `/drinks/espressos/${e.id ?? ""}`,
  topRow: {
    title: `${e.targetWeight} : ${e.beansWeight}`,
    pill: e.rating ? `${e.rating}/10 ★` : undefined,
  },
  bottomRow: {
    date: e.date.toDate(),
    tags: [...(e.grinder ? [{ icon: <MapPinIcon />, label: e.grinder }] : [])],
  },
});
