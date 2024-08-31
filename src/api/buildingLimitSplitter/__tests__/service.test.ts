import { BuildingLimitSplitterService } from "../buildingLimitSplitterService";
import { BuildingLimitSplitterRepository } from "../buildingLimitSplitterRepository";

describe("BuildingLimitSplitterService", () => {
  let buildingLimitSplitterService: BuildingLimitSplitterService;
  let buildingRepositoryMock: BuildingLimitSplitterRepository;

  beforeEach(() => {
    buildingRepositoryMock = new BuildingLimitSplitterRepository();
    buildingLimitSplitterService = new BuildingLimitSplitterService(buildingRepositoryMock);
  });

  describe("insertSplitBuildingLimit", () => {
    it("should insert split building limit and return success response", async () => {
      // Arrange
      const refid = "123";
      const buildingLimits = /* provide building limits */;
      const heightPlateau = /* provide height plateau */;
      const splitLimits = /* provide split limits */;

      // Mock the repository method
      buildingRepositoryMock.insertSplitBuildingLimit = jest.fn().mockResolvedValue(true);

      // Act
      const result = await buildingLimitSplitterService.insertSplitBuildingLimit({
        refid,
        buildingLimits,
        heightPlateau,
        splitLimits,
      });

      // Assert
      expect(buildingRepositoryMock.insertSplitBuildingLimit).toHaveBeenCalledWith({
        refid,
        buildingLimits,
        heightPlateau,
        splitLimits,
      });
      expect(result.success).toBe(true);
      expect(result.message).toBe("Building limit split successfully");
      expect(result.data).toBe(splitLimits);
    });

    it("should retry and throw an error if conflict is detected", async () => {
      // Arrange
      const refid = "123";
      const buildingLimits = /* provide building limits */;
      const heightPlateau = /* provide height plateau */;
      const splitLimits = /* provide split limits */;

      // Mock the repository method to throw an error on the first call
      buildingRepositoryMock.insertSplitBuildingLimit = jest
        .fn()
        .mockRejectedValueOnce(new Error("Conflict detected"))
        .mockResolvedValue(true);

      // Act
      const result = await buildingLimitSplitterService.insertSplitBuildingLimit({
        refid,
        buildingLimits,
        heightPlateau,
        splitLimits,
      });

      // Assert
      expect(buildingRepositoryMock.insertSplitBuildingLimit).toHaveBeenCalledTimes(2);
      expect(result.success).toBe(true);
      expect(result.message).toBe("Building limit split successfully");
      expect(result.data).toBe(splitLimits);
    });
  });
});