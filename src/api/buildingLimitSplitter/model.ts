import mongoose from "mongoose";

const buildingLimitSplitterSchema = new mongoose.Schema(
  {
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
  },
  {
    versionKey: "__v",
    optimisticConcurrency: true,
  },
);

// mongoose doesn't update __v field for findOneAndUpdate, so this is recommended middleware to update it
// https://mongoosejs.com/docs/guide.html#versionKey
buildingLimitSplitterSchema.pre("findOneAndUpdate", async function (next) {
  const update: any = this.getUpdate();
  if (update.__v != null) {
    update.__v = undefined;
  }
  const keys = ["$set", "$setOnInsert"];
  for (const key of keys) {
    if (update[key] != null && update[key].__v != null) {
      update[key].__v = undefined;
      if (Object.keys(update[key]).length === 0) {
        delete update[key];
      }
    }
  }
  update.$inc = update.$inc || {};
  update.$inc.__v = 1;
});

const BuildingLimitSplitter = mongoose.model("BuildingLimitSplitter", buildingLimitSplitterSchema);
export default BuildingLimitSplitter;
