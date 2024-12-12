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
const node_cron_1 = __importDefault(require("node-cron"));
const todoModel_1 = __importDefault(require("../models/todoModel"));
const nodemailer_1 = require("../helper/nodemailer");
node_cron_1.default.schedule("* * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentTime = new Date();
        const todos = yield todoModel_1.default.find({
            reminderTime: { $lte: currentTime },
            status: { $ne: "completed" },
        })
            .populate("userId", "username email")
            .exec();
        console.log("todos", todos);
        for (const todo of todos) {
            if (todo.userId) {
                const userEmail = todo.userId.email;
                const subject = `Reminder: ${todo.title}`;
                const text = `This is a reminder for your Todo task: ${todo.title}.\nDue date: ${todo.dueDate}\nDescription: ${todo.description}`;
                yield (0, nodemailer_1.sendReminderEmail)(userEmail, subject, text);
                console.log(`Reminder sent for Todo: ${todo.title}`);
            }
        }
    }
    catch (error) {
        console.error("Error while sending email reminders:", error);
    }
}));
