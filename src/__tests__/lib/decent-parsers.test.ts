import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { parseJsonShot, parseTclShot } from "~/lib/decent-parsers";

// Helper to load fixtures
const loadFixture = (filename: string): string => {
  const fixturePath = join(
    __dirname,
    "../fixtures/decent-shots",
    filename
  );
  return readFileSync(fixturePath, "utf-8");
};

describe("parseJsonShot", () => {
  it("should parse a valid JSON shot file", () => {
    const jsonContent = loadFixture("20230427T143835.json");
    const result = parseJsonShot(jsonContent);

    // Verify espresso data
    expect(result.espresso).toBeDefined();
    expect(result.espresso.partial).toBe(true);
    expect(result.espresso.fromDecent).toBe(true);
    expect(result.espresso.profileName).toBeDefined();
    expect(result.espresso.date).toBeInstanceOf(Date);
    expect(result.espresso.targetWeight).toBeGreaterThan(0);
    expect(result.espresso.actualTime).toBeGreaterThan(0);
    expect(result.espresso.actualWeight).toBeGreaterThan(0);
    expect(result.espresso.uploadedAt).toBeInstanceOf(Date);
  });

  it("should parse time series data correctly", () => {
    const jsonContent = loadFixture("20230427T143835.json");
    const result = parseJsonShot(jsonContent);

    // Verify time series
    expect(result.timeSeries).toBeDefined();
    expect(result.timeSeries.time).toBeInstanceOf(Array);
    expect(result.timeSeries.pressure).toBeInstanceOf(Array);
    expect(result.timeSeries.weightTotal).toBeInstanceOf(Array);
    expect(result.timeSeries.flow).toBeInstanceOf(Array);
    expect(result.timeSeries.weightFlow).toBeInstanceOf(Array);
    expect(result.timeSeries.temperatureBasket).toBeInstanceOf(Array);
    expect(result.timeSeries.temperatureMix).toBeInstanceOf(Array);
    expect(result.timeSeries.pressureGoal).toBeInstanceOf(Array);
    expect(result.timeSeries.temperatureGoal).toBeInstanceOf(Array);
    expect(result.timeSeries.flowGoal).toBeInstanceOf(Array);

    // All arrays should be populated (may have slightly different lengths due to sensor sampling)
    const length = result.timeSeries.time.length;
    expect(length).toBeGreaterThan(0);
    expect(result.timeSeries.pressure.length).toBeGreaterThan(0);
    expect(result.timeSeries.weightTotal.length).toBeGreaterThan(0);
    expect(result.timeSeries.flow.length).toBeGreaterThan(0);
    expect(result.timeSeries.weightFlow.length).toBeGreaterThan(0);
    expect(result.timeSeries.temperatureBasket.length).toBeGreaterThan(0);
    expect(result.timeSeries.temperatureMix.length).toBeGreaterThan(0);
    expect(result.timeSeries.pressureGoal.length).toBeGreaterThan(0);
    expect(result.timeSeries.temperatureGoal.length).toBeGreaterThan(0);
    expect(result.timeSeries.flowGoal.length).toBeGreaterThan(0);

    // Arrays should be roughly the same length (within a few samples)
    expect(Math.abs(result.timeSeries.pressure.length - length)).toBeLessThan(5);
    expect(Math.abs(result.timeSeries.flow.length - length)).toBeLessThan(5);
  });

  it("should extract timestamp correctly", () => {
    const jsonContent = loadFixture("20230427T143835.json");
    const result = parseJsonShot(jsonContent);

    // Timestamp is 1682602715 (from fixture file)
    // Expected date: Thu Apr 27 2023 14:38:35
    expect(result.espresso.date.getFullYear()).toBe(2023);
    expect(result.espresso.date.getMonth()).toBe(3); // April (0-indexed)
    expect(result.espresso.date.getDate()).toBe(27);
  });

  it("should parse numeric values correctly", () => {
    const jsonContent = loadFixture("20230427T143835.json");
    const result = parseJsonShot(jsonContent);

    // All time series values should be numbers
    result.timeSeries.time.forEach((val) => {
      expect(typeof val).toBe("number");
      expect(isNaN(val)).toBe(false);
    });

    result.timeSeries.pressure.forEach((val) => {
      expect(typeof val).toBe("number");
      expect(isNaN(val)).toBe(false);
    });

    result.timeSeries.flow.forEach((val) => {
      expect(typeof val).toBe("number");
      expect(isNaN(val)).toBe(false);
    });
  });

  it("should handle second JSON fixture", () => {
    const jsonContent = loadFixture("20230429T165034.json");
    const result = parseJsonShot(jsonContent);

    expect(result.espresso).toBeDefined();
    expect(result.espresso.fromDecent).toBe(true);
    expect(result.timeSeries.time.length).toBeGreaterThan(0);
  });
});

describe("parseTclShot", () => {
  it("should parse a valid TCL shot file", () => {
    const tclContent = loadFixture("20230427T143835.shot");
    const result = parseTclShot(tclContent);

    // Verify espresso data
    expect(result.espresso).toBeDefined();
    expect(result.espresso.partial).toBe(true);
    expect(result.espresso.fromDecent).toBe(true);
    expect(result.espresso.profileName).toBeDefined();
    expect(result.espresso.date).toBeInstanceOf(Date);
    expect(result.espresso.targetWeight).toBeGreaterThan(0);
    expect(result.espresso.actualTime).toBeGreaterThan(0);
    expect(result.espresso.actualWeight).toBeGreaterThan(0);
    expect(result.espresso.uploadedAt).toBeInstanceOf(Date);
  });

  it("should parse time series data correctly", () => {
    const tclContent = loadFixture("20230427T143835.shot");
    const result = parseTclShot(tclContent);

    // Verify time series
    expect(result.timeSeries).toBeDefined();
    expect(result.timeSeries.time).toBeInstanceOf(Array);
    expect(result.timeSeries.pressure).toBeInstanceOf(Array);
    expect(result.timeSeries.weightTotal).toBeInstanceOf(Array);
    expect(result.timeSeries.flow).toBeInstanceOf(Array);
    expect(result.timeSeries.weightFlow).toBeInstanceOf(Array);
    expect(result.timeSeries.temperatureBasket).toBeInstanceOf(Array);
    expect(result.timeSeries.temperatureMix).toBeInstanceOf(Array);
    expect(result.timeSeries.pressureGoal).toBeInstanceOf(Array);
    expect(result.timeSeries.temperatureGoal).toBeInstanceOf(Array);
    expect(result.timeSeries.flowGoal).toBeInstanceOf(Array);

    // All arrays should be populated (may have slightly different lengths due to sensor sampling)
    const length = result.timeSeries.time.length;
    expect(length).toBeGreaterThan(0);
    expect(result.timeSeries.pressure.length).toBeGreaterThan(0);
    expect(result.timeSeries.weightTotal.length).toBeGreaterThan(0);
    expect(result.timeSeries.flow.length).toBeGreaterThan(0);
    expect(result.timeSeries.weightFlow.length).toBeGreaterThan(0);
    expect(result.timeSeries.temperatureBasket.length).toBeGreaterThan(0);
    expect(result.timeSeries.temperatureMix.length).toBeGreaterThan(0);
    expect(result.timeSeries.pressureGoal.length).toBeGreaterThan(0);
    expect(result.timeSeries.temperatureGoal.length).toBeGreaterThan(0);
    expect(result.timeSeries.flowGoal.length).toBeGreaterThan(0);

    // Arrays should be roughly the same length (within a few samples)
    expect(Math.abs(result.timeSeries.pressure.length - length)).toBeLessThan(5);
    expect(Math.abs(result.timeSeries.flow.length - length)).toBeLessThan(5);
  });

  it("should extract timestamp correctly", () => {
    const tclContent = loadFixture("20230427T143835.shot");
    const result = parseTclShot(tclContent);

    // Timestamp is 1682602715 (from fixture file)
    // Expected date: Thu Apr 27 2023 14:38:35
    expect(result.espresso.date.getFullYear()).toBe(2023);
    expect(result.espresso.date.getMonth()).toBe(3); // April (0-indexed)
    expect(result.espresso.date.getDate()).toBe(27);
  });

  it("should parse numeric values correctly", () => {
    const tclContent = loadFixture("20230427T143835.shot");
    const result = parseTclShot(tclContent);

    // All time series values should be numbers
    result.timeSeries.time.forEach((val) => {
      expect(typeof val).toBe("number");
      expect(isNaN(val)).toBe(false);
    });

    result.timeSeries.pressure.forEach((val) => {
      expect(typeof val).toBe("number");
      expect(isNaN(val)).toBe(false);
    });

    result.timeSeries.flow.forEach((val) => {
      expect(typeof val).toBe("number");
      expect(isNaN(val)).toBe(false);
    });
  });

  it("should handle second TCL fixture", () => {
    const tclContent = loadFixture("20230429T165034.shot");
    const result = parseTclShot(tclContent);

    expect(result.espresso).toBeDefined();
    expect(result.espresso.fromDecent).toBe(true);
    expect(result.timeSeries.time.length).toBeGreaterThan(0);
  });

  it("should extract profile name correctly", () => {
    const tclContent = loadFixture("20230427T143835.shot");
    const result = parseTclShot(tclContent);

    expect(result.espresso.profileName).toBeDefined();
    expect(typeof result.espresso.profileName).toBe("string");
    expect(result.espresso.profileName.length).toBeGreaterThan(0);
  });

  it("should calculate total time from time series", () => {
    const tclContent = loadFixture("20230427T143835.shot");
    const result = parseTclShot(tclContent);

    // actualTime should be the last value in the time series
    const lastTime = result.timeSeries.time[result.timeSeries.time.length - 1];
    expect(result.espresso.actualTime).toBeCloseTo(lastTime, 1);
  });
});

describe("JSON vs TCL parser consistency", () => {
  it("should produce similar results for the same shot in both formats", () => {
    const jsonContent = loadFixture("20230427T143835.json");
    const tclContent = loadFixture("20230427T143835.shot");

    const jsonResult = parseJsonShot(jsonContent);
    const tclResult = parseTclShot(tclContent);

    // Date should match
    expect(jsonResult.espresso.date.getTime()).toBe(
      tclResult.espresso.date.getTime()
    );

    // Basic fields should match
    expect(jsonResult.espresso.fromDecent).toBe(tclResult.espresso.fromDecent);
    expect(jsonResult.espresso.partial).toBe(tclResult.espresso.partial);

    // Time series should have similar length (within a few data points)
    const jsonLength = jsonResult.timeSeries.time.length;
    const tclLength = tclResult.timeSeries.time.length;
    expect(Math.abs(jsonLength - tclLength)).toBeLessThan(5);

    // Target weight should be similar
    expect(jsonResult.espresso.targetWeight).toBeCloseTo(
      tclResult.espresso.targetWeight,
      0
    );
  });
});

describe("Error handling", () => {
  it("should throw on invalid JSON", () => {
    expect(() => parseJsonShot("not valid json")).toThrow();
  });

  it("should throw on malformed TCL (missing clock)", () => {
    expect(() => parseTclShot("no clock field here")).toThrow();
  });

  it("should throw on malformed TCL (missing title)", () => {
    const invalidTcl = `clock 1682602715\nsome other data`;
    expect(() => parseTclShot(invalidTcl)).toThrow();
  });

  it("should throw on malformed TCL (missing target_weight)", () => {
    const invalidTcl = `clock 1682602715\n"title": "Test Profile"`;
    expect(() => parseTclShot(invalidTcl)).toThrow();
  });
});
