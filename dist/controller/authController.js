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
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = __importDefault(require("../models/userModel"));
const helper_1 = __importDefault(require("../helper"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Enter in logIn :>> ", req.body);
        if (helper_1.default.validateResult(req, res)) {
            return;
        }
        const { username, password, email } = req.body;
        const existingUser = yield userModel_1.default.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already taken" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield userModel_1.default.create({
            username,
            password: hashedPassword,
            email,
        });
        res
            .status(201)
            .json({ message: "User registered successfully", userId: newUser });
    }
    catch (error) {
        res.status(500).json({ message: "Registration failed", error });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (helper_1.default.validateResult(req, res)) {
            return;
        }
        const { username, password } = req.body;
        const user = (yield userModel_1.default.findOne({ username }));
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password" });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        console.log("isPasswordValid", isPasswordValid);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid username or password" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({
            message: "Login successful",
            token,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Login failed", error });
    }
});
exports.login = login;
