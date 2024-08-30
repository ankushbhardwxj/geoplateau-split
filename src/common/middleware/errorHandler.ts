import { logger } from "@/server";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ValidationError } from "../errors/validationError";
import { ServiceResponse } from "../models/serviceResponse";
import { handleServiceResponse } from "../utils/httpHandlers";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ValidationError) {
    handleServiceResponse(ServiceResponse.failure(err.message, null, StatusCodes.BAD_REQUEST), res);
    err.log({ req, res });
    return;
  }
  logger.error({
    message: err.message,
    req: {
      method: req.method,
      url: req.url,
    },
    context: res.locals.ctx,
    stack: err.stack,
  });
  handleServiceResponse(ServiceResponse.failure("Internal Server Error", null, StatusCodes.INTERNAL_SERVER_ERROR), res);
}
