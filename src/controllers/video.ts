import { NextFunction, Request, Response } from "express";
import upload from "../middleware/multerVideoUpload";
import { CourseVideo } from "../models/video";
import course from "../models/course";
import { Types } from "mongoose";
import getVideoDuration from "../utility/calculateVideoDuration";


export const uploadVideo = [

    upload.single('videoFile'), async (req: Request, res: Response, next: NextFunction) => {
        const courseId = req.params.id;
      
        if (!req.file) {
          return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
      
        try {
          const duration  = await getVideoDuration(req.file.path);

          const newVideo = new CourseVideo({

            videoName: req.file.filename,
            videoDescription: "string",
            videoDuration: duration,
            videoUrl: req.file.path
          });
      
          await newVideo.save();
      
          const uploadToCourse = await course.findById(courseId);
          if (!uploadToCourse) {
            return res.status(404).json({ success: false, message: 'Course not found' });
          }

      
         const vidId = new Types.ObjectId(newVideo._id as string)

          uploadToCourse.courseVideos?.push(vidId);

          await uploadToCourse.save();
      
          // Respond with success
          return res.status(200).json({
            success: true,
            message: 'Video uploaded successfully',
            video: newVideo
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({
            success: false,
            message: 'Error uploading video',
            error: error
          });
        }
      }

]

export const deleteVideo = async  (req: Request, res:Response, next: NextFunction)=>{

}

export const  getVideoById = async (req: Request, res:Response, next: NextFunction)=>{

}

