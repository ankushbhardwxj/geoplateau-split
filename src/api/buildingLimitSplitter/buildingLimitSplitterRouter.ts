import { createApiRequest } from "@/api-docs/openAPIRequestBuilder";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import inputValidator from "@/common/middleware/inputValidator";
import { validateRequestBody } from "@/common/utils/httpHandlers";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { buildingLimitSplitterController } from "./buildingLimitSplitterController";

export const buildingLimitRegistry = new OpenAPIRegistry();
export const buildingLimitRouter: Router = express.Router();

const BuildingLimitResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  responseObject: z.array(z.object({})),
});

const BuildingLimitRequestSchema = z.object({
  refid: z.number(),
  building_limits: z.object({}),
  height_plateaus: z.object({}),
});

buildingLimitRegistry.registerPath({
  method: "post",
  path: "/api/v1/geo/split-building-limit",
  tags: ["Building Limit Splitter"],
  request: createApiRequest(BuildingLimitRequestSchema),
  responses: createApiResponse(BuildingLimitResponseSchema, "Success"),
});

buildingLimitRouter.post(
  "/split-building-limit",
  validateRequestBody(BuildingLimitRequestSchema),
  inputValidator,
  buildingLimitSplitterController.getBuildingLimitSplitter,
);
