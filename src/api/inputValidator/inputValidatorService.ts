import { ValidationError } from "@/common/errors/validationError";
import { GeoJSONInputData } from "@/common/types/input";
import { area, booleanValid, booleanWithin, featureCollection, intersect, polygon, union } from "@turf/turf";
import { Feature, Polygon } from "geojson";



/**
 * Validates the input data received, and pushes it to the 
 * in-memory queue, if it is valid
 */
export class InputValidatorService {
  public geoJsonData: GeoJSONInputData
  
  constructor(data: GeoJSONInputData) {
    this.geoJsonData = data;
  }

  isInputGeoJSONValid(): boolean {
    const isBuildingLimitValid = this.geoJsonData.building_limits.features.every((feature) => booleanValid(feature.geometry));
    const isHeightPlateausValid = this.geoJsonData.height_plateaus.features.every((feature) => booleanValid(feature.geometry));
    return isBuildingLimitValid && isHeightPlateausValid
  }

  checkCompleteCoverage(): boolean {
    const { height_plateaus, building_limits } = this.geoJsonData;
    const heightPlateausPolygons = height_plateaus.features.map((feature: Feature) => {
      const {coordinates} = feature.geometry as Polygon;
      return polygon(coordinates);
    });
    const combinedHeightPlateau = union(featureCollection(heightPlateausPolygons));
    if (!combinedHeightPlateau ) {
      throw new ValidationError("Validation Error: Height plateaus do not completely cover the building limits");
    }
    const isCompletelyCovered = booleanWithin(building_limits.features[0], combinedHeightPlateau);
    return isCompletelyCovered;
  }

  checkGapsBetweenHeightPlateaus(): boolean {
    let totalArea = 0;
    const { height_plateaus } = this.geoJsonData;
    const heightPlateausPolygon = height_plateaus.features.map((feature: Feature) => {
      const {coordinates} = feature.geometry as Polygon;
      const p = polygon(coordinates)
      totalArea += area(p);
      return p
    });
    const heightPlateausUnion = union(featureCollection(heightPlateausPolygon));
    if (!heightPlateausUnion)  {
      throw new ValidationError("Validation Error: Gaps exists between height plateaus");
    }
    const totalAreaMerged = (area(heightPlateausUnion));
    if (totalArea < totalAreaMerged) {
      throw new ValidationError("Validation Error: Gaps exists between height plateaus");
    } 
    return true;
  }

  checkInvalidElevations(): boolean {
    const { height_plateaus } = this.geoJsonData;
    height_plateaus.features.forEach((feature: Feature) => {
      const elevation = feature.properties?.elevation;
      if (!elevation || elevation <= 0) {
        throw new ValidationError("Validation Error: Invalid elevation found");
      }
    })
    return true;
  }

  checkOverLappingPlateaus(): boolean {
    const areaThreshold = 0.0001;
    const { height_plateaus } = this.geoJsonData;
    for (let i = 0; i < height_plateaus.features.length; i++) {
      for (let j=i+1; j < height_plateaus.features.length; j++) {
        const polygon1 = height_plateaus.features[i].geometry as Polygon;
        const polygon2 = height_plateaus.features[j].geometry as Polygon;
        const feature1 = polygon(polygon1.coordinates);
        const feature2 = polygon(polygon2.coordinates);
        const intersection = intersect(featureCollection([feature1, feature2]));
        if (intersection && area(intersection) > areaThreshold) {
          throw new ValidationError("Validation Error: Overlapping plateaus found");
        }
      }
    }
    return true;
  }

  validateInput(): boolean {
    const checks = [
      this.isInputGeoJSONValid(),
      this.checkInvalidElevations(),
      this.checkOverLappingPlateaus(),
      this.checkCompleteCoverage(),
      this.checkGapsBetweenHeightPlateaus(),
    ]
    checks.forEach((check) => check);
    return true;
  }
}