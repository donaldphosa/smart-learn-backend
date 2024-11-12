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
exports.purchaseCourse = exports.updateUser = exports.logout = exports.login = exports.signup = void 0;
const user_1 = __importDefault(require("../models/user"));
const passwordutility_1 = require("../utility/passwordutility");
const jwtUtil_1 = require("../utility/jwtUtil");
const mongoose_1 = require("mongoose");
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, username, name, surname } = req.body;
        if (!username) {
            res.status(400).json({ message: 'Username is required.' });
            return;
        }
        if (!email) {
            res.status(400).json({ message: 'email is required.' });
            return;
        }
        if (!password) {
            res.status(400).json({ message: 'password is required.' });
            return;
        }
        if (!surname) {
            return res.status(400).json({ message: 'surname is required.' });
        }
        if (!name) {
            return res.status(400).json({ message: 'name is required.' });
        }
        const existingUser = yield user_1.default.findOne({ email: email });
        if (existingUser) {
            return res.status(500).json({ message: "user already exist", success: false });
        }
        const salt = yield (0, passwordutility_1.generateSalt)();
        const hashedPassword = yield (0, passwordutility_1.hashPassword)(password, salt);
        const newUser = yield user_1.default.create({ username, email, password: hashedPassword, salt: salt, name, surname });
        newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    }
    catch (err) {
        res.status(500).json({ message: "user not created", success: false, error: err });
    }
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email) {
            res.status(400).json({ message: 'email is required.' });
            return;
        }
        if (!password) {
            res.status(400).json({ message: 'password is required.' });
            return;
        }
        const user = yield user_1.default.findOne({ email: email });
        if (!user) {
            return res.status(500).json({ message: "user not found", success: false });
        }
        const isValidPassword = yield (0, passwordutility_1.comparePasswords)(password, user.password);
        if (!isValidPassword) {
            return res.status(500).json({ message: "invalid password", success: false });
        }
        const token = (0, jwtUtil_1.generateToken)(user);
        return res.status(200).json({ message: 'User logged in successfully', success: true, token: token });
    }
    catch (err) {
        res.status(500).json({ message: "user not created", success: false, error: err });
    }
});
exports.login = login;
// implement later when you  have a good understanding of JWT and cookie sessions
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.logout = logout;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // find provided details by user
        const newUserDetails = req.body;
        // merge new details with existing user details
        const updatedDetails = Object.assign(Object.assign({}, req.user), newUserDetails);
        const email = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.email;
        if (!email) {
            return res.status(400).json({ message: 'User not found in request.', success: false });
        }
        const updatedUser = yield user_1.default.findOneAndUpdate({ email: email }, updatedDetails, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.', success: false });
        }
        res.status(200).json({ message: 'User updated successfully', success: true, user: updatedUser });
    }
    catch (err) {
        res.status(500).json({ message: 'An error occurred while updating the user.', success: false, error: err });
    }
});
exports.updateUser = updateUser;
const purchaseCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const courseId = req.params.id;
        const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user.email;
        const user = yield user_1.default.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found." });
        }
        if (!mongoose_1.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ success: false, message: "Invalid course ID." });
        }
        const courseObjectId = new mongoose_1.Types.ObjectId(courseId);
        if ((_b = user.enrolledCourses) === null || _b === void 0 ? void 0 : _b.includes(courseObjectId)) {
            return res.status(400).json({
                success: false,
                message: "User is already enrolled in this course."
            });
        }
        (_c = user.enrolledCourses) === null || _c === void 0 ? void 0 : _c.push(courseObjectId);
        yield user.save();
        return res.status(200).json({
            message: "Course purchased successfully",
            success: true
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Error purchasing the course", error: error || error });
    }
});
exports.purchaseCourse = purchaseCourse;
