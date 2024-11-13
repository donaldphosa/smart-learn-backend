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
exports.deleteCourse = exports.updateCourse = exports.filterCourses = exports.createCourse = exports.getCourseById = exports.getAllCourses = void 0;
const course_1 = __importDefault(require("../models/course"));
const user_1 = __importDefault(require("../models/user"));
const getAllCourses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield course_1.default.find().populate("courseVideos");
        if (!courses) {
            return res.status(404).json({ message: "No courses found.", success: false });
        }
        return res.status(200).json({ message: "Courses fetched successfully", success: true, courses: courses });
    }
    catch (err) {
        return res.status(500).json({
            message: 'Error fetching courses',
            error: err,
            succuss: false
        });
    }
});
exports.getAllCourses = getAllCourses;
const getCourseById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = req.params.id;
        if (!courseId) {
            return res.status(400).json({ message: "An error occured", success: false });
        }
        const singleCourse = yield course_1.default.findById(courseId).populate("courseVideos");
        if (!singleCourse) {
            return res.status(400).json({ message: "No course found", success: false });
        }
        return res.status(200).json({ message: "course fetched successfully", success: true, course: singleCourse });
    }
    catch (err) {
        return res.status(500).json({ message: "Error getting course", success: false });
    }
});
exports.getCourseById = getCourseById;
const createCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseName, courseDescription, courseDuration, coursePrice, courseVideos, category, author } = req.body;
        if (!courseName || !courseDescription || !courseDuration || !coursePrice) {
            return res.status(400).json({ message: "Please fill all fields", success: false });
        }
        const newCourse = yield course_1.default.create({
            courseName,
            courseDescription,
            courseDuration,
            coursePrice,
            courseVideos,
            category,
            author
        });
        if (!newCourse) {
            return res.status(400).json({ message: "Error creating course", success: false });
        }
        return res.status(201).json({ message: "Course created successfully", success: true, course: newCourse });
    }
    catch (err) {
        return res.status(500).json({ message: "Error creating course", success: false });
    }
});
exports.createCourse = createCourse;
/**
*you can pass upto 4 query strings which are minDuration, maxDuration, category and  price
*and filter courses based on the values provided
*/
const filterCourses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, maxPrice, minDuration, maxDuration } = req.query;
        const filter = {};
        if (category) {
            filter.category = category;
        }
        if (maxPrice) {
            filter.coursePrice = {};
            if (maxPrice)
                filter.coursePrice.$lte = Number(maxPrice);
        }
        if (minDuration || maxDuration) {
            filter.courseDuration = {};
            if (minDuration)
                filter.courseDuration.$gte = Number(minDuration);
            if (maxDuration)
                filter.courseDuration.$lte = Number(maxDuration);
        }
        const courses = yield course_1.default.find(filter);
        res.status(200).json({
            success: true,
            courses: courses,
        });
    }
    catch (err) {
        return res.status(500).json({ message: "error filtering courses", success: false, error: err });
    }
});
exports.filterCourses = filterCourses;
const updateCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = req.params.id;
        const newCourseDetails = req.body;
        const existingCourse = yield course_1.default.findById(courseId);
        if (!existingCourse) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }
        // Merge the new details with the existing course details
        const updatedCourse = Object.assign(existingCourse, newCourseDetails);
        yield updatedCourse.save();
        return res.status(200).json({
            success: true,
            course: updatedCourse,
        });
    }
    catch (err) {
        return res.status(500).json({ message: "error while updating the course", success: false, error: err });
    }
});
exports.updateCourse = updateCourse;
const deleteCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = req.params.id;
        if (!courseId) {
            return res.status(400).json({ success: false, message: "Course id is required" });
        }
        const deletedCourse = yield course_1.default.findByIdAndDelete(courseId);
        if (!deletedCourse) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        yield user_1.default.updateMany({ enrolledCourses: courseId }, { $pull: { enrolledCourses: courseId } });
        return res.status(201).json({ message: "course deleted successfully", course: deletedCourse });
    }
    catch (error) {
        return res.status(500).json({ message: "error deleting course", success: false, error: error });
    }
});
exports.deleteCourse = deleteCourse;
