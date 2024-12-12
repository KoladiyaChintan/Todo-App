"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todoController_1 = require("../controller/todoController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const express_validator_1 = require("express-validator");
const messages_1 = __importDefault(require("../helper/messages"));
const router = express_1.default.Router();
router.post("/", authMiddleware_1.default, [
    (0, express_validator_1.body)("title").notEmpty().withMessage(messages_1.default.TITLE_IS_REQUIRED),
    (0, express_validator_1.body)("description").notEmpty().withMessage(messages_1.default.DESCRIPTION_IS_REQUIRED),
    (0, express_validator_1.body)("dueDate").notEmpty().withMessage(messages_1.default.DUEDATE_IS_REQUIRED),
    (0, express_validator_1.body)("reminderTime").optional(),
], todoController_1.createTodo);
router.get("/", authMiddleware_1.default, [(0, express_validator_1.query)("date").notEmpty().withMessage(messages_1.default.DUEDATE_IS_REQUIRED)], todoController_1.list);
router.put("/:todoId", authMiddleware_1.default, [
    (0, express_validator_1.param)("todoId").notEmpty().withMessage(messages_1.default.ID_IS_REQUIRED).bail(),
    (0, express_validator_1.body)("title").notEmpty().withMessage(messages_1.default.TITLE_IS_REQUIRED),
    (0, express_validator_1.body)("description").notEmpty().withMessage(messages_1.default.DESCRIPTION_IS_REQUIRED),
    (0, express_validator_1.body)("dueDate").notEmpty().withMessage(messages_1.default.DUEDATE_IS_REQUIRED),
    (0, express_validator_1.body)("reminderTime").optional(),
], todoController_1.editTodo);
router.delete("/:todoId", authMiddleware_1.default, [(0, express_validator_1.param)("todoId").notEmpty().withMessage(messages_1.default.ID_IS_REQUIRED).bail()], todoController_1.deleteTodo);
router.patch("/:todoId/change-status", authMiddleware_1.default, [
    (0, express_validator_1.param)("todoId").notEmpty().withMessage(messages_1.default.ID_IS_REQUIRED).bail(),
    (0, express_validator_1.body)("status").notEmpty().withMessage(messages_1.default.STATUS_IS_REQUIRED),
], todoController_1.todoCompletion);
exports.default = router;
