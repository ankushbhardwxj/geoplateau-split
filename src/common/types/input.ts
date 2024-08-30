import type { AllGeoJSON } from "@turf/turf";
import type { Feature, FeatureCollection } from "geojson";

export type ExtractFeatureCollection<T> = T extends { type: "FeatureCollection" } ? T : never;
export type FeatureCollectionType = ExtractFeatureCollection<AllGeoJSON>;

export type ExtractFeature<T> = T extends { type: "Feature" } ? T : never;
export type FeatureType = ExtractFeature<AllGeoJSON>;

export type GeoJSONInputData = {
  refid: number;
  building_limits: FeatureCollectionType;
  height_plateaus: FeatureCollectionType;
};

export type GeoJSONDTO = {
  refid: number;
  buildingLimits: FeatureCollection;
  heightPlateau: FeatureCollection;
  splitLimits: Array<Feature>;
};
