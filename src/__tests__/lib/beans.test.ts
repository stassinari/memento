import { describe, expect, it } from "vitest";
import { BeanOrigin } from "~/db/schema";
import { Beans } from "~/db/types";
import {
  daysBetween,
  formatAge,
  getActivitySummary,
  getBeanActions,
  getBeanDescriptor,
  getBeanStatus,
  getFreshness,
  getRoastLevelLabel,
  ROAST_LEVELS,
} from "~/lib/beans";

/** UTC-midnight date, matching how Drizzle returns `date({ mode: "date" })`. */
const utc = (y: number, m: number, d: number) => new Date(Date.UTC(y, m - 1, d));

/** Minimal bean; only the fields each function reads need to be real. */
const makeBean = (overrides: Partial<Beans>): Beans =>
  ({
    origin: BeanOrigin.SingleOrigin,
    roastDate: null,
    freezeDate: null,
    thawDate: null,
    archiveDate: null,
    isArchived: false,
    country: null,
    process: null,
    blendParts: null,
    ...overrides,
  }) as Beans;

describe("daysBetween", () => {
  it("counts whole days, floored", () => {
    expect(daysBetween(utc(2026, 5, 12), utc(2026, 5, 19))).toBe(7);
  });

  it("is never negative", () => {
    expect(daysBetween(utc(2026, 5, 19), utc(2026, 5, 12))).toBe(0);
  });

  it("is 0 for the same day", () => {
    expect(daysBetween(utc(2026, 5, 12), utc(2026, 5, 12))).toBe(0);
  });
});

describe("getFreshness", () => {
  const today = utc(2026, 6, 13);

  it("open + roastDate → effective == calendar, no frozen days", () => {
    const f = getFreshness(makeBean({ roastDate: utc(2026, 6, 4) }), today);
    expect(f.state).toBe("open");
    expect(f.hasRoastDate).toBe(true);
    expect(f.calendarDays).toBe(9);
    expect(f.effectiveDays).toBe(9);
    expect(f.frozenDays).toBe(0);
    expect(f.endDate).toEqual(today);
  });

  it("frozen → clock paused at freezeDate", () => {
    const f = getFreshness(
      makeBean({ roastDate: utc(2026, 5, 12), freezeDate: utc(2026, 5, 19) }),
      today,
    );
    expect(f.state).toBe("frozen");
    expect(f.effectiveDays).toBe(7); // roast → freeze
    expect(f.frozenDays).toBe(daysBetween(utc(2026, 5, 19), today)); // freeze → today
    expect(f.calendarDays).toBe(daysBetween(utc(2026, 5, 12), today));
  });

  it("thawed → aging resumes, frozen gap excluded", () => {
    const f = getFreshness(
      makeBean({
        roastDate: utc(2026, 5, 12),
        freezeDate: utc(2026, 5, 19),
        thawDate: utc(2026, 6, 9),
      }),
      today,
    );
    expect(f.state).toBe("thawed");
    expect(f.frozenDays).toBe(21); // 19 May → 9 Jun
    expect(f.calendarDays).toBe(32); // 12 May → 13 Jun
    expect(f.effectiveDays).toBe(11); // 32 − 21
  });

  it("archived → timeline caps at archiveDate", () => {
    const f = getFreshness(
      makeBean({
        roastDate: utc(2026, 1, 1),
        isArchived: true,
        archiveDate: utc(2026, 2, 4),
      }),
      today,
    );
    expect(f.endDate).toEqual(utc(2026, 2, 4));
    expect(f.calendarDays).toBe(34); // 1 Jan → 4 Feb
    expect(f.effectiveDays).toBe(34);
  });

  it("archived legacy (null archiveDate) → falls back to today", () => {
    const f = getFreshness(
      makeBean({
        roastDate: utc(2026, 6, 4),
        isArchived: true,
        archiveDate: null,
      }),
      today,
    );
    expect(f.isArchived).toBe(true);
    expect(f.archiveDate).toBeNull();
    expect(f.endDate).toEqual(today);
    expect(f.calendarDays).toBe(9);
  });

  it("no roastDate → null ages, prompt state", () => {
    const f = getFreshness(makeBean({ roastDate: null }), today);
    expect(f.hasRoastDate).toBe(false);
    expect(f.effectiveDays).toBeNull();
    expect(f.calendarDays).toBeNull();
    expect(f.frozenDays).toBe(0);
  });

  it("no roastDate but frozen → still reports frozen state", () => {
    const f = getFreshness(makeBean({ roastDate: null, freezeDate: utc(2026, 6, 1) }), today);
    expect(f.hasRoastDate).toBe(false);
    expect(f.state).toBe("frozen");
  });
});

describe("getBeanStatus", () => {
  it("archived wins over everything", () => {
    expect(getBeanStatus(makeBean({ isArchived: true, freezeDate: utc(2026, 6, 1) }))).toBe(
      "archived",
    );
  });
  it("open when never frozen", () => {
    expect(getBeanStatus(makeBean({}))).toBe("open");
  });
  it("frozen when freeze and no thaw", () => {
    expect(getBeanStatus(makeBean({ freezeDate: utc(2026, 6, 1) }))).toBe("frozen");
  });
  it("thawed when both dates present", () => {
    expect(
      getBeanStatus(makeBean({ freezeDate: utc(2026, 6, 1), thawDate: utc(2026, 6, 5) })),
    ).toBe("thawed");
  });
});

describe("getBeanActions", () => {
  it("open → freeze + archive only", () => {
    expect(getBeanActions(makeBean({}))).toEqual({
      canFreeze: true,
      canThaw: false,
      canArchive: true,
      canUnarchive: false,
    });
  });
  it("frozen → thaw + archive only", () => {
    expect(getBeanActions(makeBean({ freezeDate: utc(2026, 6, 1) }))).toEqual({
      canFreeze: false,
      canThaw: true,
      canArchive: true,
      canUnarchive: false,
    });
  });
  it("thawed → no freeze/thaw, archive only", () => {
    const bean = makeBean({ freezeDate: utc(2026, 6, 1), thawDate: utc(2026, 6, 5) });
    expect(getBeanActions(bean)).toEqual({
      canFreeze: false,
      canThaw: false,
      canArchive: true,
      canUnarchive: false,
    });
  });
  it("archived wins → only unarchive (even if frozen underneath)", () => {
    const bean = makeBean({ isArchived: true, freezeDate: utc(2026, 6, 1) });
    expect(getBeanActions(bean)).toEqual({
      canFreeze: false,
      canThaw: false,
      canArchive: false,
      canUnarchive: true,
    });
  });
});

describe("getBeanDescriptor", () => {
  it("process + country → 'Kenya · Washed'", () => {
    expect(getBeanDescriptor(makeBean({ process: "Washed", country: "Kenya" }))).toBe(
      "Kenya · Washed",
    );
  });
  it("country only → country name", () => {
    expect(getBeanDescriptor(makeBean({ country: "Kenya" }))).toBe("Kenya");
  });
  it("process only → process name", () => {
    expect(getBeanDescriptor(makeBean({ process: "Washed" }))).toBe("Washed");
  });
  it("neither → 'Single origin'", () => {
    expect(getBeanDescriptor(makeBean({}))).toBe("Single origin");
  });
  it("blend with parts → 'Blend · N parts'", () => {
    expect(
      getBeanDescriptor(
        makeBean({
          origin: BeanOrigin.Blend,
          blendParts: [{} as never, {} as never],
        }),
      ),
    ).toBe("Blend · 2 parts");
  });
  it("blend with one part → singular", () => {
    expect(
      getBeanDescriptor(makeBean({ origin: BeanOrigin.Blend, blendParts: [{} as never] })),
    ).toBe("Blend · 1 part");
  });
  it("blend with no parts → 'Blend'", () => {
    expect(getBeanDescriptor(makeBean({ origin: BeanOrigin.Blend, blendParts: null }))).toBe(
      "Blend",
    );
  });
});

describe("getRoastLevelLabel", () => {
  it("maps 0–4 to named levels", () => {
    expect(getRoastLevelLabel(0)).toBe("Light");
    expect(getRoastLevelLabel(2)).toBe("Medium");
    expect(getRoastLevelLabel(4)).toBe("Dark");
    expect(ROAST_LEVELS).toHaveLength(5);
  });
  it("returns null for null/undefined/out-of-range", () => {
    expect(getRoastLevelLabel(null)).toBeNull();
    expect(getRoastLevelLabel(undefined)).toBeNull();
    expect(getRoastLevelLabel(5)).toBeNull();
    expect(getRoastLevelLabel(-1)).toBeNull();
  });
});

describe("formatAge", () => {
  it("counts days below ~4 months", () => {
    expect(formatAge(0)).toEqual({ value: 0, unit: "days" });
    expect(formatAge(1)).toEqual({ value: 1, unit: "day" });
    expect(formatAge(9)).toEqual({ value: 9, unit: "days" });
    expect(formatAge(119)).toEqual({ value: 119, unit: "days" });
  });

  it("rounds to months from 120 days up to ~24 months", () => {
    expect(formatAge(120)).toEqual({ value: 4, unit: "months" });
    expect(formatAge(150)).toEqual({ value: 5, unit: "months" });
    expect(formatAge(729)).toEqual({ value: 24, unit: "months" });
  });

  it("rounds to years past ~24 months", () => {
    expect(formatAge(730)).toEqual({ value: 2, unit: "years" });
    expect(formatAge(1095)).toEqual({ value: 3, unit: "years" });
  });
});

describe("getActivitySummary", () => {
  it("averages rated drinks across all three types", () => {
    const s = getActivitySummary({
      brews: [{ rating: 8 }, { rating: 9 }],
      espressos: [{ rating: 7 }],
      sampledInTastings: [{ overall: 8 }],
    });
    expect(s.totalCount).toBe(4);
    expect(s.brewCount).toBe(2);
    expect(s.espressoCount).toBe(1);
    expect(s.tastingCount).toBe(1);
    expect(s.ratedCount).toBe(4);
    expect(s.avgScore).toBe(8); // (8+9+7+8)/4
  });

  it("ignores unrated drinks in the average but counts them", () => {
    const s = getActivitySummary({
      brews: [{ rating: null }, { rating: 9 }],
      espressos: [{ rating: null }],
      sampledInTastings: [],
    });
    expect(s.totalCount).toBe(3);
    expect(s.ratedCount).toBe(1);
    expect(s.avgScore).toBe(9);
  });

  it("avgScore null when nothing rated", () => {
    const s = getActivitySummary({
      brews: [{ rating: null }],
      espressos: [],
      sampledInTastings: [],
    });
    expect(s.totalCount).toBe(1);
    expect(s.ratedCount).toBe(0);
    expect(s.avgScore).toBeNull();
  });

  it("handles no drinks at all", () => {
    const s = getActivitySummary({
      brews: [],
      espressos: [],
      sampledInTastings: [],
    });
    expect(s.totalCount).toBe(0);
    expect(s.avgScore).toBeNull();
  });
});
