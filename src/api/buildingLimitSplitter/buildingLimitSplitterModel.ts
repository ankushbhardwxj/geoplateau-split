import mongoose from "mongoose";

const buildingLimitSplitterSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
    default: 123,
  },
  buildingLimits: {
    type: Object,
    required: true,
  },
  heightPlateau: {
    type: Object,
    required: true,
  },
  buildingLimitSplitted: {
    type: Object,
    required: true,
  },
}, {
  versionKey: "__v",
  optimisticConcurrency: true,
  strict: false
});

const BuildingLimitSplitter = mongoose.model("BuildingLimitSplitter", buildingLimitSplitterSchema);
export default BuildingLimitSplitter;