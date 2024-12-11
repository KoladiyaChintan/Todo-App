import express from "express";
import {
  createTodo,
  deleteTodo,
  editTodo,
  list,
  todoCompletion,
} from "../controller/todoController";
import middleware from "../middlewares/authMiddleware";
import { body, query, param } from "express-validator";
import message from "../helper/messages";

const router = express.Router();

router.post(
  "/",
  middleware,
  [
    body("title").notEmpty().withMessage(message.TITLE_IS_REQUIRED),
    body("description").notEmpty().withMessage(message.DESCRIPTION_IS_REQUIRED),
    body("dueDate").notEmpty().withMessage(message.DUEDATE_IS_REQUIRED),
    body("reminderTime").optional(),
  ],
  createTodo
);

router.get(
  "/",
  middleware,
  [query("date").notEmpty().withMessage(message.DUEDATE_IS_REQUIRED)],
  list
);

router.put(
  "/:todoId",
  middleware,
  [
    param("todoId").notEmpty().withMessage(message.ID_IS_REQUIRED).bail(),
    body("title").notEmpty().withMessage(message.TITLE_IS_REQUIRED),
    body("description").notEmpty().withMessage(message.DESCRIPTION_IS_REQUIRED),
    body("dueDate").notEmpty().withMessage(message.DUEDATE_IS_REQUIRED),
    body("reminderTime").optional(),
  ],
  editTodo
);

router.delete(
  "/:todoId",
  middleware,
  [param("todoId").notEmpty().withMessage(message.ID_IS_REQUIRED).bail()],
  deleteTodo
);

router.patch(
  "/:todoId/change-status",
  middleware,
  [
    param("todoId").notEmpty().withMessage(message.ID_IS_REQUIRED).bail(),
    body("status").notEmpty().withMessage(message.STATUS_IS_REQUIRED),
  ],

  todoCompletion
);

export default router;
