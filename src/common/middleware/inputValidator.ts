import { InputValidatorService } from "@/api/inputValidator/inputValidatorService";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { GeoJSONInputData } from "../types/input";

const inputValidator: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const body: unknown = req.body;
  const inputValidation = new InputValidatorService(body as GeoJSONInputData);
  inputValidation.validateInput();
  next();
}

export default inputValidator