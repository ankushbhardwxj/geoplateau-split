import { GeoJSONInputData } from "@/common/types/input";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { booleanIntersects, featureCollection, intersect, polygon } from "@turf/turf";
import { Request, RequestHandler, Response } from "express";
import { Feature } from "geojson";
import { buildingLimitSplitterService } from "./buildingLimitSplitterService";


class BuildingLimitSplitterController {
  public getBuildingLimitSplitter: RequestHandler = async (req: Request, res: Response) => {
      const {building_limits: buildingLimits, height_plateaus: heightPlateau, refid } = req.body as GeoJSONInputData;
      const splitLimits: Array<Feature> = [];
      buildingLimits.features.forEach((buildingLimit: any) => {
        heightPlateau.features.forEach((heightPlateau: any) => {
          const intersects = booleanIntersects(buildingLimit, heightPlateau);
          if (intersects) {
            const feature1 = polygon(buildingLimit.geometry.coordinates);
            const feature2 = polygon(heightPlateau.geometry.coordinates);
            const intersection = intersect(featureCollection([feature1, feature2]));
            if (intersection) {
              intersection.properties = {
                elevation: heightPlateau?.properties?.elevation,
              };
              splitLimits.push(intersection);
            }
          }
        });
      })
      const serviceResponse = await buildingLimitSplitterService.insertSplitBuildingLimit({ refid, buildingLimits, heightPlateau, splitLimits});
      return handleServiceResponse(serviceResponse, res);
  }
}


export const buildingLimitSplitterController = new BuildingLimitSplitterController();