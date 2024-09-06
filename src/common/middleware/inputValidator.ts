import { InputValidatorService } from "@/api/inputValidator/service";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { GeoJSONInputData } from "../types/input";

const geojsonInputValidator: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const body: GeoJSONInputData = req.body;
  const inputValidation = new InputValidatorService(body);
  inputValidation.validateInput();
  next();
};

export default geojsonInputValidator;
