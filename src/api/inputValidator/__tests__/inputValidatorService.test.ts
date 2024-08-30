import fs from "node:fs";
import { InputValidatorService } from "../inputValidatorService";

describe("InputValidatorService", () => {
  let inputValidatorService: InputValidatorService;

  beforeEach(() => {
    // Initialize the InputValidatorService instance with test data
    const filePath = "src/api/inputValidator/__tests__/testData.json";
    const rawData = fs.readFileSync(filePath, "utf-8");
    const testData = JSON.parse(rawData);
    inputValidatorService = new InputValidatorService(testData);
  });

  describe("isInputGeoJSONValid", () => {
    it("should return true if the input GeoJSON is valid", () => {
      const isValid = inputValidatorService.isInputGeoJSONValid();
      expect(isValid).toBe(true);
    });
  });

  describe("checkCompleteCoverage", () => {
    it("should return true if the height plateaus completely cover the building limits", () => {
      const isCompletelyCovered = inputValidatorService.checkCompleteCoverage();
      expect(isCompletelyCovered).toBe(true);
    });
  });

  describe("checkGapsBetweenHeightPlateaus", () => {
    it("should return true if there are no gaps between the height plateaus", () => {
      const hasNoGaps = inputValidatorService.checkGapsBetweenHeightPlateaus();
      expect(hasNoGaps).toBe(true);
    });
  });

  describe("checkInvalidElevations", () => {
    it("should return true if there are no invalid elevations in the height plateaus", () => {
      const hasNoInvalidElevations = inputValidatorService.checkInvalidElevations();
      expect(hasNoInvalidElevations).toBe(true);
    });
  });

  describe("checkOverLappingPlateaus", () => {
    it("should return true if there are no overlapping plateaus", () => {
      const hasNoOverlappingPlateaus = inputValidatorService.checkOverLappingPlateaus();
      expect(hasNoOverlappingPlateaus).toBe(true);
    });
  });

  describe("validateInput", () => {
    it("should return true if all validation checks pass", () => {
      const isValid = inputValidatorService.validateInput();
      expect(isValid).toBe(true);
    });
  });
});
