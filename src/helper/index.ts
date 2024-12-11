import { Request, Response } from "express";
import { validationResult, ValidationError } from "express-validator";
import message from "./messages";

interface ResponseData {
  status: number;
  message: string;
  data: any;
}

const response = (status: number, message: string, data: any): ResponseData => {
  return { status, message, data };
};

const services = {
  sendResponse: function (
    res: Response,
    httpStatus: number,
    message: string,
    data: any
  ): void {
    res.status(httpStatus).send(response(httpStatus, message, data));
  },

  validateResult: function (req: Request, res: Response): boolean {
    const errors: ValidationError[] = validationResult(req).array();
    if (errors.length > 0) {
      services.sendResponse(
        res,
        400,
        errors[0].msg || message.VALIDATION_FAILED,
        errors
      );
      return true;
    }
    return false;
  },
};

export default services;
