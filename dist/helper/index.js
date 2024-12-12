"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const messages_1 = __importDefault(require("./messages"));
const response = (status, message, data) => {
    return { status, message, data };
};
const services = {
    sendResponse: function (res, httpStatus, message, data) {
        res.status(httpStatus).send(response(httpStatus, message, data));
    },
    validateResult: function (req, res) {
        const errors = (0, express_validator_1.validationResult)(req).array();
        if (errors.length > 0) {
            services.sendResponse(res, 400, errors[0].msg || messages_1.default.VALIDATION_FAILED, errors);
            return true;
        }
        return false;
    },
};
exports.default = services;
