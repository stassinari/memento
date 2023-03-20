import { MapPinIcon } from "@heroicons/react/20/solid";
import { Brew } from "../../types/brew";
import { DataListItem } from "../DataList";

export const brewToDataListItem = (b: Brew): DataListItem => ({
  link: `/drinks/brews/${b.id ?? ""}`,
  topRow: {
    title: b.method,
    pill: b.rating ? `${b.rating}/10 ★` : undefined,
  },
  bottomRow: {
    date: b.date.toDate(),
    tags: [...(b.grinder ? [{ icon: <MapPinIcon />, label: b.grinder }] : [])],
  },
});
