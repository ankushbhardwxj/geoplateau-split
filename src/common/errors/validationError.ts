import { logger } from "@/server";
import { Request, Response } from "express";

export class ValidationError extends Error {
  private meta;
  private error;
  constructor(message: string, meta?: unknown) {
    super(message);
    this.name = "ValidationError";
    if (meta instanceof Error) {
      this.error = {
        error: meta.message,
        stack: meta.stack,
      };
      return;
    }
    if (meta) {
      this.meta = { ...meta };
    }
  }

  log({req, res}: {req: Request, res: Response}) {
    const conf = {
      message: this.message,
      error: {
        message: this.message,
        stack: this.stack,
      },
      meta: this.meta,
      req: {},
      context: {}
    };
    if (req) {
      conf.req = {
        method: req.method,
        url: req.url,
      };
    }
    if (res.locals.ctx) {
      conf.context = res.locals.ctx;
    }
    logger.warn(conf);
  }
}