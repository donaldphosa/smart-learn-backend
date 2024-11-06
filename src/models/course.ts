import mongoose, { Document, Schema } from 'mongoose';
import { CourseVideoDTO } from '../dto/video.dto';
import { CourseVideo } from './video';

interface Course extends Document{
    courseName:string;
    courseDescription:string;
    courseDuration: number;
    coursePrice: number;
    courseVideos? :  mongoose.Types.ObjectId[];
    category:string;
    author?:string;
}


const  courseSchema = new Schema<Course>({

    courseName:{  type:String, required:true },
    courseDescription:{type:String,required:true},
    courseDuration:{type:Number,required:true},
    coursePrice:{type:Number,required:true},
    courseVideos:{type:[{ type: mongoose.Types.ObjectId, ref: 'CourseVideo' }]},
    category:{type:String,required:true},
    author:{type:String,required:false}
},{timestamps:true})


courseSchema.methods.toJSON = function () {
    const course = this;
    const courseObject = course.toObject();

    delete courseObject.__v; 
    delete courseObject.createdAt;
    delete courseObject.updatedAt;

    return courseObject;
};

export  default mongoose.model<Course>('Course', courseSchema);
