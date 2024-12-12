import { Request, Response } from "express";
import Todo from "../models/todoModel";
import services from "../helper";

const createTodo = async (req: any, res: Response): Promise<any> => {
  try {
    if (services.validateResult(req, res)) {
      return;
    }
    const { title, description, dueDate, reminderTime } = req.body;
    const userId = req.userId;
    const reminderDate = reminderTime ? new Date(reminderTime) : null;

    const newTodo = await Todo.create({
      title,
      description,
      dueDate,
      userId,
      reminderTime: reminderDate,
    });

    res
      .status(201)
      .json({ message: "Todo created successfully", todo: newTodo });
  } catch (error) {
    res.status(500).json({ message: "Failed to create Todo", error });
  }
};

const list = async (req: any, res: Response): Promise<any> => {
  try {
    if (services.validateResult(req, res)) {
      return;
    }
    const queryParams = req.query;
    const { date } = queryParams;
    const userId = req.userId;

    const query: any = {
      userId: userId,
    };

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);

      query.dueDate = { $gte: startDate, $lt: endDate };
    }
    const todos = await Todo.find(query);

    if (todos.length === 0) {
      return res.status(404).json({ message: "No todos found" });
    }

    res.status(200).json({ todos });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve Todos", error });
  }
};

const editTodo = async (req: any, res: Response): Promise<any> => {
  try {
    if (services.validateResult(req, res)) {
      return;
    }
    const { todoId } = req.params;
    const { title, description, dueDate, reminderTime } = req.body;
    const userId = req.userId;

    const todo = await Todo.findOne({ _id: todoId, userId });

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    if (title) todo.title = title;
    if (description) todo.description = description;
    if (dueDate) todo.dueDate = new Date(dueDate);
    if (reminderTime) todo.reminderTime = new Date(reminderTime);

    await todo.save();

    res.status(200).json({ message: "Todo updated successfully", todo });
  } catch (error) {
    res.status(500).json({ message: "Failed to update Todo", error });
  }
};

const deleteTodo = async (req: any, res: Response): Promise<any> => {
  try {
    if (services.validateResult(req, res)) {
      return;
    }
    const { todoId } = req.params;
    const userId = req.userId;

    const todo = await Todo.findOne({ _id: todoId, userId });

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found ",
      });
    }
    await todo.deleteOne();

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve Todos", error });
  }
};

const todoCompletion = async (req: any, res: Response): Promise<any> => {
  try {
    if (services.validateResult(req, res)) {
      return;
    }
    const { todoId } = req.params;
    const userId = req.userId;
    const { status } = req.body;

    const todo = await Todo.findOne({ _id: todoId, userId });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (status === "completed") {
      todo.status = "completed";
      await todo.save();
      return res
        .status(200)
        .json({ message: "Todo marked as completed", todo });
    } else {
      todo.status = "pending";
      await todo.save();
      return res
        .status(200)
        .json({ message: "Todo unmarked as completed", todo });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to update Todos", error });
  }
};

export { createTodo, list, editTodo, deleteTodo, todoCompletion };
