import { MapPinIcon, UsersIcon } from "@heroicons/react/20/solid";
import { Schema } from "firebase/vertexai";
import { Beans, RoastStyle } from "../../types/beans";
import { DataListItem } from "../DataList";
import type { BeansFormInputs } from "./BeansForm";

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

export function parseVertexBeansToBeansFormInput(
  json: any,
): BeansFormInputs | null {
  try {
    // Basic type checks for required fields
    if (
      typeof json.name !== "string" ||
      typeof json.roaster !== "string" ||
      typeof json.roastStyle !== "string" ||
      typeof json.roastLevel !== "number" ||
      !Array.isArray(json.roastingNotes) ||
      typeof json.country !== "string" ||
      !Array.isArray(json.varietals) ||
      typeof json.process !== "string"
    ) {
      return null;
    }

    // Parse dates as JS Date objects (or null)
    const roastDate =
      typeof json.roastDate === "number"
        ? new Date(json.roastDate * 1000)
        : null;

    const harvestDate =
      typeof json.harvestDate === "string" ? new Date(json.harvestDate) : null;

    return {
      name: json.name,
      roaster: json.roaster,
      roastDate,
      roastStyle: json.roastStyle as RoastStyle,
      roastLevel: json.roastLevel,
      roastingNotes: json.roastingNotes,
      origin: "single-origin",
      country: json.country,
      varietals: json.varietals,
      altitude: typeof json.altitude === "number" ? json.altitude : null,
      process: json.process,
      farmer: typeof json.farmer === "string" ? json.farmer : null,
      harvestDate,
      region: typeof json.region === "string" ? json.region : null,
      blend: [],
      freezeDate: null,
      thawDate: null,
      isFinished: false,
    };
  } catch {
    return null;
  }
}

export const beansVertexSchema = Schema.object({
  properties: {
    name: Schema.string({
      description:
        "The name that the roaster gave to the beans. It usually includes the farm/place where the beans are from.",
      example: "Hacienda La Papaya",
    }),
    roaster: Schema.string({
      description:
        "The name of the roaster. This is usually the company that roasted the beans.",
      example: "La Cabra",
    }),

    roastDate: Schema.number({
      description:
        "The date the beans were roasted on. The format is a unix timestamp in seconds.",
      example: 1746805164,
      nullable: true,
      default: null,
    }),

    roastStyle: Schema.enumString({
      enum: ["filter", "espresso", "omni-roast"],
      description:
        "The roast style of the beans. If it usually is clearly stated if it's a filter or espresso roast. The words 'filter' or 'espresso' are usually somewhere in the description.",
      example: "espresso",
      //   nullable: true,
    }),
    roastLevel: Schema.number({
      description:
        "The roast level of the beans, expressed as an integer number between 0 and 4, where 0 is very light and 4 is very dark. Sometimes it will be expressed as a word (light, medium, dark).",
      example: 1,
      //   nullable: true,
      //   default: null,
    }),
    roastingNotes: Schema.array({
      items: Schema.string({
        description:
          "A single tasting note of the beans. Usually the name of a fruit or food (apricot, marzipan), sometimes just a taste descriptor (sweet). Use one or two words. Capitalise only the first letter of the first word.",
        example: "Peach",
      }),
      description:
        "The tasting notes of the beans. This is usually a list of words that describe the beans. Use as many items as you see fit.",
      example: ["Chocolate", "Caramel", "Fruity"],
      default: [],
    }),
    country: Schema.string({
      description: "The country where the beans were grown.",
      example: "Ethiopia",
      //   nullable: true,
    }),
    region: Schema.string({
      description: "The region within the country where the beans were grown.",
      example: "Yirgacheffe",
      //   nullable: true,
    }),
    varietals: Schema.array({
      items: Schema.string({
        description: "The varietals of the coffee beans.",
        example: "Heirloom",
      }),
      description: "A list of varietals for the beans.",
      example: ["Heirloom", "Bourbon"],
    }),
    altitude: Schema.number({
      description: "The altitude at which the beans were grown, in meters.",
      example: 2000,
      nullable: true,
    }),
    process: Schema.string({
      description:
        "The process used to prepare the beans (e.g., washed, natural).",
      example: "Washed",
      //   nullable: true,
    }),
    farmer: Schema.string({
      description: "The name of the farmer or producer of the beans.",
      example: "Tesfaye Bekele",
      nullable: true,
    }),
    harvestDate: Schema.string({
      description:
        "The month and year the beans were harvested. The format is a unix timestamp in seconds, and corresponds to the first day of the month.",
      example: 1746805164,
      nullable: true,
    }),
  },
});
