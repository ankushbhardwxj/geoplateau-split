import inputValidator from "@/common/middleware/inputValidator";
import express, { Router } from "express";
import { buildingLimitSplitterController } from "./buildingLimitSplitterController";

export const buildingLimitRouter: Router = express.Router();

buildingLimitRouter.post("/", inputValidator, buildingLimitSplitterController.getBuildingLimitSplitter);