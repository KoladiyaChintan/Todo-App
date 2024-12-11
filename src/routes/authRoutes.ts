import express from "express";
import { login, register } from "../controller/authController";
import { body } from "express-validator";
import message from "../helper/messages";

const router = express.Router();

router.post(
  "/register",
  [
    body("username").notEmpty().withMessage(message.USERNAME_IS_REQUIRED),
    body("password").notEmpty().withMessage(message.PASSWORD_IS_REQUIRED),
    body("email").notEmpty().withMessage(message.EMAIL_IS_REQUIRED).isEmail(),
  ],
  register
);

router.post(
  "/login",
  [
    body("username").notEmpty().withMessage(message.USERNAME_IS_REQUIRED),
    body("password").notEmpty().withMessage(message.PASSWORD_IS_REQUIRED),
  ],
  login
);

export default router;
