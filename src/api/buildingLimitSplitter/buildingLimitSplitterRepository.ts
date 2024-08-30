import { GeoJSONDTO } from "@/common/types/input";
import BuildingLimitSplitter from "./buildingLimitSplitterModel";

export class BuildingLimitSplitterRepository {
  private buildingSplitModel: typeof BuildingLimitSplitter
  constructor() {
    this.buildingSplitModel = BuildingLimitSplitter;
  }

  async findByRefid(_id: string) {
    return await this.buildingSplitModel.findOne({_id});
  }

  async insertSplitBuildingLimit({refid, buildingLimits, heightPlateau, splitLimits}: GeoJSONDTO) {
    const result = await this.buildingSplitModel.findOneAndUpdate({
      _id: refid, 
    }, {
      _id: refid,
      buildingLimits,
      heightPlateau,
      buildingLimitSplitted: splitLimits,
    }, {
      upsert: true,
      new: true,
    })
    return result;
  }

  async createSplitBuildingLimit({ buildingLimits, heightPlateau, splitLimits}: GeoJSONDTO) {
    const newBuildingSplit = new this.buildingSplitModel({
      buildingLimits,
      heightPlateau,
      buildingLimitSplitted: splitLimits
    });
    return await newBuildingSplit.save();
  }
}