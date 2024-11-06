import mongoose from "mongoose";

export interface CourseVideoDTO{
    videoName:string;
    videoDescription:string;
    videoDuration: number;
    videoUrl:string,
}