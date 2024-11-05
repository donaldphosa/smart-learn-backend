import { NextFunction, Request, Response } from "express";
import course from "../models/course";
import { courseDTO, updateCourseDTO } from "../dto/course.dto";


export const getAllCourses = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const courses = await course.find().populate("courseVideos");

        if (!courses) {
            return res.status(404).json({ message: "No courses found.", success: false })
        }

        return res.status(200).json({ message: "Courses fetched successfully", success: true, courses: courses });
    } catch (err) {
        return res.status(500).json({
            message: 'Error fetching courses',
            error: err,
            succuss: false
        })
    }
}

export const getCourseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = req.params.id;

        if (!courseId) {
            return res.status(400).json({ message: "An error occured", success: false })
        }

        const singleCourse = await course.findById(courseId).populate("courseVideos");

        if (!singleCourse) {
            return res.status(400).json({ message: "No course found", success: false })
        }

        return res.status(200).json({ message: "course fetched successfully", success: true, course: singleCourse });
    } catch (err) {
        return res.status(500).json({ message: "Error getting course", success: false });
    }
}

export const createCourse = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { courseName, courseDescription, courseDuration, coursePrice, courseVideos, category, author } = <courseDTO>req.body;

        if(!courseName || !courseDescription || !courseDuration || !coursePrice){
            return res.status(400).json({ message: "Please fill all fields", success: false});
        }

        const newCourse = await course.create({
            courseName,
            courseDescription,
            courseDuration,
            coursePrice,
            courseVideos,
            category,
            author
        });

        if(!newCourse){
            return res.status(400).json({ message: "Error creating course", success: false });
        }

        return  res.status(201).json({ message: "Course created successfully", success: true, course:newCourse});


    } catch (err) {
        return res.status(500).json({ message: "Error creating course", success: false });
    }
}

/** 
*you can pass upto 4 query strings which are minDuration, maxDuration, category and  price
*and filter courses based on the values provided
*/
export const filterCourses = async  (req: Request, res: Response, next: NextFunction) => {

    try{
        const { category, maxPrice, minDuration, maxDuration } = req.query;

        const filter: any = {};

        if (category) {
          filter.category = category;
        }
    
        if (maxPrice) {
          filter.coursePrice = {};
          if (maxPrice) filter.coursePrice.$lte = Number(maxPrice); 
        }
    
        if (minDuration || maxDuration) {
          filter.courseDuration = {};
          if (minDuration) filter.courseDuration.$gte = Number(minDuration); 
          if (maxDuration) filter.courseDuration.$lte = Number(maxDuration); 
        }

        const courses = await course.find(filter);

        res.status(200).json({
          success: true,
          courses: courses,
        });
    
    }catch(err){
        return res.status(500).json({message:"error filtering courses",success:false,error:err});
    }
}

export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
  
      const newCourseDetails = req.body;
  
      const existingCourse = await course.findById(courseId);
  
      if (!existingCourse) {
        return res.status(404).json({
          success: false,
          message: 'Course not found',
        });
      }
  
      // Merge the new details with the existing course details
      const updatedCourse = Object.assign(existingCourse, newCourseDetails);
  
      await updatedCourse.save();
  
      return res.status(200).json({
        success: true,
        course: updatedCourse,
      });
  
    } catch (err) {
        return res.status(500).json({message:"error while updating the course",success:false,error:err})
    }
  };
