import mongoose from "mongoose";

export interface courseDTO{
    courseName:string;
    courseDescription:string;
    courseDuration: number;
    coursePrice: number;
    courseVideos : mongoose.Schema.Types.ObjectId[];
    category:string;
    author:string;
}

export interface updateCourseDTO{
    courseName?:string;
    courseDescription?:string;
    courseDuration?: number;
    coursePrice?: number;
    courseVideos?: mongoose.Schema.Types.ObjectId[];
    category?:string;
    author:string;
}