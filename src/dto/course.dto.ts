import { CourseVideoDTO } from "./video.dto";

export interface courseDTO{
    courseName:string;
    courseDescription:string;
    courseDuration: number;
    coursePrice: number;
    courseVideos : CourseVideoDTO[];
    category:string;
    author:string;
}

export interface updateCourseDTO{
    courseName?:string;
    courseDescription?:string;
    courseDuration?: number;
    coursePrice?: number;
    courseVideos?: CourseVideoDTO[];
    category?:string;
    author:string;
}