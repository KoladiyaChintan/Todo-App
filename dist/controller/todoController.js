"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoCompletion = exports.deleteTodo = exports.editTodo = exports.list = exports.createTodo = void 0;
const todoModel_1 = __importDefault(require("../models/todoModel"));
const helper_1 = __importDefault(require("../helper"));
const createTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (helper_1.default.validateResult(req, res)) {
            return;
        }
        const { title, description, dueDate, reminderTime } = req.body;
        const userId = req.userId;
        const reminderDate = reminderTime ? new Date(reminderTime) : null;
        const newTodo = yield todoModel_1.default.create({
            title,
            description,
            dueDate,
            userId,
            reminderTime: reminderDate,
        });
        res
            .status(201)
            .json({ message: "Todo created successfully", todo: newTodo });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create Todo", error });
    }
});
exports.createTodo = createTodo;
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (helper_1.default.validateResult(req, res)) {
            return;
        }
        const queryParams = req.query;
        const { date } = queryParams;
        const userId = req.userId;
        const startDate = new Date(date);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);
        const todos = yield todoModel_1.default.find({
            userId: userId,
            dueDate: { $gte: startDate, $lt: endDate },
        });
        if (todos.length === 0) {
            return res.status(404).json({ message: "No todos found for this date" });
        }
        res.status(200).json({ todos });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to retrieve Todos", error });
    }
});
exports.list = list;
const editTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (helper_1.default.validateResult(req, res)) {
            return;
        }
        const { todoId } = req.params;
        const { title, description, dueDate, reminderTime } = req.body;
        const userId = req.userId;
        const todo = yield todoModel_1.default.findOne({ _id: todoId, userId });
        if (!todo) {
            return res.status(404).json({
                message: "Todo not found",
            });
        }
        if (title)
            todo.title = title;
        if (description)
            todo.description = description;
        if (dueDate)
            todo.dueDate = new Date(dueDate);
        if (reminderTime)
            todo.reminderTime = new Date(reminderTime);
        yield todo.save();
        res.status(200).json({ message: "Todo updated successfully", todo });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update Todo", error });
    }
});
exports.editTodo = editTodo;
const deleteTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (helper_1.default.validateResult(req, res)) {
            return;
        }
        const { todoId } = req.params;
        const userId = req.userId;
        const todo = yield todoModel_1.default.findOne({ _id: todoId, userId });
        if (!todo) {
            return res.status(404).json({
                message: "Todo not found ",
            });
        }
        yield todo.deleteOne();
        res.status(200).json({ message: "Todo deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to retrieve Todos", error });
    }
});
exports.deleteTodo = deleteTodo;
const todoCompletion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (helper_1.default.validateResult(req, res)) {
            return;
        }
        const { todoId } = req.params;
        const userId = req.userId;
        const { status } = req.body;
        const todo = yield todoModel_1.default.findOne({ _id: todoId, userId });
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        if (status === "completed") {
            todo.status = "completed";
            yield todo.save();
            return res
                .status(200)
                .json({ message: "Todo marked as completed", todo });
        }
        else {
            todo.status = "pending";
            yield todo.save();
            return res
                .status(200)
                .json({ message: "Todo unmarked as completed", todo });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update Todos", error });
    }
});
exports.todoCompletion = todoCompletion;
