import { GeoJSONInputData } from "@/common/types/input";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { booleanIntersects, featureCollection, intersect, polygon } from "@turf/turf";
import { Request, RequestHandler, Response } from "express";
import { buildingLimitSplitterService } from "./buildingLimitSplitterService";

class BuildingLimitSplitterController {
  public getBuildingLimitSplitter: RequestHandler = async (req: Request, res: Response) => {
      const {building_limits: buildingLimits, height_plateaus: heightPlateau } = req.body as unknown as GeoJSONInputData;
      const splitLimits: any = [];
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
            }
            splitLimits.push(intersection);
          }
        });
      })
      const serviceResponse = await buildingLimitSplitterService.insertSplitBuildingLimit(splitLimits);
      return handleServiceResponse(serviceResponse, res);
  }
}


export const buildingLimitSplitterController = new BuildingLimitSplitterController();