"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controller/authController");
const express_validator_1 = require("express-validator");
const messages_1 = __importDefault(require("../helper/messages"));
const router = express_1.default.Router();
router.post("/register", [
    (0, express_validator_1.body)("username").notEmpty().withMessage(messages_1.default.USERNAME_IS_REQUIRED),
    (0, express_validator_1.body)("password").notEmpty().withMessage(messages_1.default.PASSWORD_IS_REQUIRED),
    (0, express_validator_1.body)("email").notEmpty().withMessage(messages_1.default.EMAIL_IS_REQUIRED).isEmail(),
], authController_1.register);
router.post("/login", [
    (0, express_validator_1.body)("username").notEmpty().withMessage(messages_1.default.USERNAME_IS_REQUIRED),
    (0, express_validator_1.body)("password").notEmpty().withMessage(messages_1.default.PASSWORD_IS_REQUIRED),
], authController_1.login);
exports.default = router;
