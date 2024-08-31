import type { GeoJSONDTO } from "@/common/types/input";
import BuildingLimitSplitter from "./model";

export class BuildingLimitSplitterRepository {
  private buildingSplitModel: typeof BuildingLimitSplitter;
  constructor() {
    this.buildingSplitModel = BuildingLimitSplitter;
  }

  // Find building limit split by refid
  async findByRefid(_id: string) {
    return await this.buildingSplitModel.findOne({ _id });
  }

  // Insert split building limit, or update if it already exists
  async insertSplitBuildingLimit({ refid, buildingLimits, heightPlateau, splitLimits }: GeoJSONDTO) {
    const result = await this.buildingSplitModel.findOneAndUpdate(
      {
        _id: refid,
      },
      {
        _id: refid,
        buildingLimits,
        heightPlateau,
        buildingLimitSplitted: splitLimits,
      },
      {
        upsert: true,
        new: true,
      },
    );
    return result;
  }

  // Create a new building limit split
  async createSplitBuildingLimit({ buildingLimits, heightPlateau, splitLimits }: GeoJSONDTO) {
    const newBuildingSplit = new this.buildingSplitModel({
      buildingLimits,
      heightPlateau,
      buildingLimitSplitted: splitLimits,
    });
    return await newBuildingSplit.save();
  }
}
