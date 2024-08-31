import { InputValidatorService } from "@/api/inputValidator/service";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { GeoJSONInputData } from "../types/input";

const inputValidator: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const body: unknown = req.body;
  const inputValidation = new InputValidatorService(body as GeoJSONInputData);
  inputValidation.validateInput();
  next();
};

export default inputValidator;
