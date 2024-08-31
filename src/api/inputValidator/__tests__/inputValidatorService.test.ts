import fs from "node:fs";
import { InputValidatorService } from "../service";

const validFilePath = "src/api/inputValidator/__tests__/testData.json";

describe("InputValidatorService", () => {
  let validInputValidatorService: InputValidatorService;

  beforeEach(() => {
    // Initialize the InputValidatorService instance with test data
    const validTestData = JSON.parse(fs.readFileSync(validFilePath, "utf-8"));
    validInputValidatorService = new InputValidatorService(validTestData);
  });

  describe("isInputGeoJSONValid", () => {
    it("should return true if the input GeoJSON is valid", () => {
      const isValid = validInputValidatorService.isInputGeoJSONValid();
      expect(isValid).toBe(true);
    });

    it("should return false if the input GeoJSON is invalid", () => {
      const invalidFilePath = "src/api/inputValidator/__tests__/invalidGeoJSONData.json";
      const invalidTestData = JSON.parse(fs.readFileSync(invalidFilePath, "utf-8"));
      const invalidInputValidatorService = new InputValidatorService(invalidTestData);
      const isValid = invalidInputValidatorService.isInputGeoJSONValid();
      expect(isValid).toBe(false);
    });
  });

  describe("checkCompleteCoverage", () => {
    it("should return true if the height plateaus completely cover the building limits", () => {
      const isCompletelyCovered = validInputValidatorService.checkCompleteCoverage();
      expect(isCompletelyCovered).toBe(true);
    });

    it("should throw an error if the height plateaus do not completely cover the building limits", () => {
      const nonOverlappingFilePath = "src/api/inputValidator/__tests__/nonOverlappingTestData.json";
      const nonOverlappingTestData = JSON.parse(fs.readFileSync(nonOverlappingFilePath, "utf-8"));
      const invalidInputValidatorService = new InputValidatorService(nonOverlappingTestData);
      expect(() => invalidInputValidatorService.checkCompleteCoverage()).toThrowError(
        "Validation Error: Height plateaus do not completely cover the building limits",
      );
    });
  });

  describe("checkGapsBetweenHeightPlateaus", () => {
    it("should return true if there are no gaps between the height plateaus", () => {
      const hasNoGaps = validInputValidatorService.checkGapsBetweenHeightPlateaus();
      expect(hasNoGaps).toBe(true);
    });

    it("show throw an error if there are gaps between the height plateaus", () => {
      const invalidGapsFilePath = "src/api/inputValidator/__tests__/invalidGapsTestData.json";
      const invalidGapsTestData = JSON.parse(fs.readFileSync(invalidGapsFilePath, "utf-8"));
      const invalidInputValidatorService = new InputValidatorService(invalidGapsTestData);
      expect(() => invalidInputValidatorService.checkGapsBetweenHeightPlateaus()).toThrowError(
        "Validation Error: Gaps exists between height plateaus",
      );
    });
  });

  describe("checkInvalidElevations", () => {
    it("should return true if there are no invalid elevations in the height plateaus", () => {
      const hasNoInvalidElevations = validInputValidatorService.checkInvalidElevations();
      expect(hasNoInvalidElevations).toBe(true);
    });

    it("show throw an error if there are invalid elevations in the height plateaus", () => {
      const invalidElevationsFilePath = "src/api/inputValidator/__tests__/invalidElevationsData.json";
      const invalidElevationsTestData = JSON.parse(fs.readFileSync(invalidElevationsFilePath, "utf-8"));
      const invalidInputValidatorService = new InputValidatorService(invalidElevationsTestData);
      expect(() => invalidInputValidatorService.checkInvalidElevations()).toThrowError(
        "Validation Error: Invalid elevation found",
      );
    });
  });

  describe("checkOverLappingPlateaus", () => {
    it("should return true if there are no overlapping plateaus", () => {
      const hasNoOverlappingPlateaus = validInputValidatorService.checkOverLappingPlateaus();
      expect(hasNoOverlappingPlateaus).toBe(true);
    });

    it("should throw an error if there are overlapping plateaus", () => {
      const overlappingFilePath = "src/api/inputValidator/__tests__/overlappingPlateausData.json";
      const overlappingTestData = JSON.parse(fs.readFileSync(overlappingFilePath, "utf-8"));
      const invalidInputValidatorService = new InputValidatorService(overlappingTestData);
      expect(() => invalidInputValidatorService.checkOverLappingPlateaus()).toThrowError(
        "Validation Error: Overlapping plateaus found",
      );
    });
  });

  describe("validateInput", () => {
    it("should return true if all validation checks pass", () => {
      const isValid = validInputValidatorService.validateInput();
      expect(isValid).toBe(true);
    });
  });
});
