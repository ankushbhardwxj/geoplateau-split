import fs from "node:fs";
import { app } from "@/server";
import request from "supertest";

let testData: unknown;
let invalidTestData: unknown;
describe("Building Limit Splitter Endpoint", () => {
  describe("POST /split-building-limit", () => {
    beforeEach(() => {
      // Initialize the InputValidatorService instance with test data
      const filePath = "src/api/buildingLimitSplitter/__tests__/testData.json";
      const invalidFilePath = "src/api/buildingLimitSplitter/__tests__/invalidTestData.json";
      testData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      invalidTestData = JSON.parse(fs.readFileSync(invalidFilePath, "utf-8"));
    });

    it("should return a list of split building limits", async () => {
      if (!testData) return;
      const response = await request(app)
        .post("/api/v1/geo/split-building-limit")
        .send(testData)
        .set("Content-Type", "application/json");
      const responseBody = response.body;
      expect(response.status).toBe(200);
      expect(responseBody.success).toBe(true);
      expect(responseBody.message).toBe("Building limit split successfully");
      expect(responseBody.responseObject.length).toBeGreaterThan(0);
    });

    it("should return an error message if the input GeoJSON is invalid", async () => {
      if (!invalidTestData) return;
      const response = await request(app)
        .post("/api/v1/geo/split-building-limit")
        .send(invalidTestData)
        .set("Content-Type", "application/json");
      const responseBody = response.body;
      expect(response.status).toBe(400);
      expect(responseBody.success).toBe(false);
      expect(responseBody.message).toBe("Validation Error: Overlapping plateaus found");
    });
  });
});
