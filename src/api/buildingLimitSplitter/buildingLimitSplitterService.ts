import { ServiceResponse } from "@/common/models/serviceResponse";
import { GeoJSONDTO } from "@/common/types/input";
import AsyncRetry from "async-retry";
import { Feature } from "geojson";
import { BuildingLimitSplitterRepository } from "./buildingLimitSplitterRepository";

export class BuildingLimitSplitterService {
  buildingRepository: BuildingLimitSplitterRepository;
  constructor() {
    this.buildingRepository = new BuildingLimitSplitterRepository();
  }

  async insertSplitBuildingLimit({refid, buildingLimits, heightPlateau, splitLimits}: GeoJSONDTO): Promise<ServiceResponse<Feature[] | null>> {
    await AsyncRetry(async (bail) => {
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
    }, {
      retries: 3, // Number of retry attempts
      onRetry: (err, attempt) => {
        console.log(`Retrying... Attempt ${attempt}`, err);
      }
    })
    return ServiceResponse.success("Building limit split successfully", splitLimits);
  }
}

export const buildingLimitSplitterService = new BuildingLimitSplitterService();