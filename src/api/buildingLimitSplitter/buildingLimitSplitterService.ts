import { ServiceResponse } from "@/common/models/serviceResponse";
import type { GeoJSONDTO } from "@/common/types/input";
import { logger } from "@/server";
import AsyncRetry from "async-retry";
import type { Feature, FeatureCollection } from "geojson";
import { BuildingLimitSplitterRepository } from "./buildingLimitSplitterRepository";

/**
 * Service class for handling business logic related to building limit splitting.
 */
export class BuildingLimitSplitterService {
  buildingRepository: BuildingLimitSplitterRepository;
  constructor() {
    this.buildingRepository = new BuildingLimitSplitterRepository();
  }

  async insertSplitBuildingLimit({
    refid,
    buildingLimits,
    heightPlateau,
    splitLimits,
  }: GeoJSONDTO): Promise<ServiceResponse<FeatureCollection | null>> {
    // Retry the operation in case of a conflict
    await AsyncRetry(
      async (bail) => {
        // persist the split building limit
        const result = await this.buildingRepository.insertSplitBuildingLimit({
          refid,
          buildingLimits,
          heightPlateau,
          splitLimits,
        });
        if (!result) {
          throw new Error("Conflict detected");
        }
        return result;
      },
      {
        retries: 3, // Number of retry attempts
        onRetry: (err, attempt) => {
          logger.warn(`Retrying... Attempt ${attempt}`, err);
        },
      },
    );
    return ServiceResponse.success("Building limit split successfully", splitLimits);
  }
}

export const buildingLimitSplitterService = new BuildingLimitSplitterService();
