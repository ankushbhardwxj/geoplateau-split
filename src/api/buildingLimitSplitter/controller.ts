import type { GeoJSONInputData } from "@/common/types/input";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { booleanIntersects, featureCollection, intersect, polygon } from "@turf/turf";
import type { Request, RequestHandler, Response } from "express";
import type { Feature, FeatureCollection } from "geojson";
import { buildingLimitSplitterService } from "./service";

/**
 * Controller class for handling requests related to building limit splitting.
 */
class BuildingLimitSplitterController {
  public splitBuildingLimits: RequestHandler = async (req: Request, res: Response) => {
    const { building_limits: buildingLimits, height_plateaus: heightPlateau, refid } = req.body as GeoJSONInputData;
    const splitLimits: FeatureCollection = {
      type: "FeatureCollection",
      features: [],
    };
    buildingLimits.features.forEach((buildingLimit: any) => {
      heightPlateau.features.forEach((heightPlateau: any) => {
        const intersects = booleanIntersects(buildingLimit, heightPlateau);
        if (intersects) {
          // parse geometry to turf polygons
          const feature1 = polygon(buildingLimit.geometry.coordinates);
          const feature2 = polygon(heightPlateau.geometry.coordinates);
          // split building limits by current height plateau
          const intersection = intersect(featureCollection([feature1, feature2]));
          // if overlap is polygon, add to results
          if (intersection && intersection.geometry.type === "Polygon") {
            this.addPolygonToCollection(splitLimits, intersection, heightPlateau);
          }
          // if overlap is multipolygon, add each polygon to results
          else if (intersection && intersection.geometry.type === "MultiPolygon") {
            intersection.geometry.coordinates.forEach((polygon: any) => {
              const feature = polygon(polygon);
              this.addPolygonToCollection(splitLimits, feature, heightPlateau);
            });
          }
        }
      });
    });
    const serviceResponse = await buildingLimitSplitterService.insertSplitBuildingLimit({
      refid,
      buildingLimits,
      heightPlateau,
      splitLimits,
    });
    return handleServiceResponse(serviceResponse, res);
  };

  addPolygonToCollection(collection: FeatureCollection, polygon: Feature, heightPlateau: Feature) {
    polygon.properties = {
      elevation: heightPlateau?.properties?.elevation,
    };
    collection.features.push(polygon);
  }
}

export const buildingLimitSplitterController = new BuildingLimitSplitterController();
