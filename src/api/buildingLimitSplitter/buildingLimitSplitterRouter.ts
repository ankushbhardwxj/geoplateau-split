import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import inputValidator from "@/common/middleware/inputValidator";
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

buildingLimitRegistry.registerPath({
  method: "post",
  path: "/split-building-limit",
  tags: ["Building Limit Splitter"],
  responses: createApiResponse(BuildingLimitResponseSchema, "Success"),
});

buildingLimitRouter.post(
  "/split-building-limit",
  inputValidator,
  buildingLimitSplitterController.getBuildingLimitSplitter,
);
