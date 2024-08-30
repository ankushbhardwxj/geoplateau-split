import { ServiceResponse } from "@/common/models/serviceResponse";

export class BuildingLimitSplitterService {
  constructor() {
    // this.buildingRepository = repository;
  }

  async insertSplitBuildingLimit(splitLimits: any) {
    return ServiceResponse.success("Building limit split", splitLimits);
  }


}

export const buildingLimitSplitterService = new BuildingLimitSplitterService();