import { Request, Response, NextFunction, Router } from "express";
import { createCourse, getAllCourses, getCourseById, filterCourses, updateCourse } from "../controllers/course";
import { authenticate } from "../middleware/authenticate";

const courseRouter = Router();

courseRouter.get('/allCourses', getAllCourses as any)
courseRouter.get('/course/:id', getCourseById as any)
courseRouter.post('/create',authenticate as any, createCourse as any)
courseRouter.get('/filterCourses',filterCourses as any)
courseRouter.post('/update/:id',authenticate as any,updateCourse as any)

export default courseRouter;
