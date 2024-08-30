import { AllGeoJSON } from "@turf/turf";

export type ExtractFeatureCollection<T> = T extends { type: "FeatureCollection" } ? T : never;
export type FeatureCollectionType = ExtractFeatureCollection<AllGeoJSON>;

export type ExtractFeature<T> = T extends { type: "Feature" } ? T : never;
export type FeatureType = ExtractFeature<AllGeoJSON>;


export type GeoJSONInputData = {
  building_limits: FeatureCollectionType,
  height_plateaus: FeatureCollectionType,
}
