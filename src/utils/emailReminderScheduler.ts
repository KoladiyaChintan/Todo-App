import cron from "node-cron";
import Todo from "../models/todoModel";
import { sendReminderEmail } from "../helper/nodemailer";

cron.schedule("* * * * *", async () => {
  try {
    const currentTime = new Date();

    const todos = await Todo.find({
      reminderTime: { $lte: currentTime },
      status: { $ne: "completed" },
    })
      .populate("userId", "username email")
      .exec();

    console.log("todos", todos);
    for (const todo of todos) {
      if (todo.userId) {
        console.log("222222222222");
        const userEmail = todo.userId.email;
        const subject = `Reminder: ${todo.title}`;
        const text = `This is a reminder for your Todo task: ${todo.title}.\nDue date: ${todo.dueDate}\nDescription: ${todo.description}`;

        await sendReminderEmail(userEmail, subject, text);
        console.log(`Reminder sent for Todo: ${todo.title}`);
      }
    }
  } catch (error) {
    console.error("Error while sending email reminders:", error);
  }
});
