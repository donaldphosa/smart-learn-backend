import mongoose, { Schema, Document } from 'mongoose';

export interface CourseVideoDTO extends Document {
  videoName: string;
  videoDescription: string;
  videoDuration: number;
  videoUrl: string;
}

const CourseVideoSchema = new Schema<CourseVideoDTO>({
  videoName: { type: String, required: true },
  videoDescription: { type: String, required: true },
  videoDuration: { type: Number, required: true },
  videoUrl: { type: String, required: true },
});

export const CourseVideo = mongoose.model<CourseVideoDTO>('CourseVideo', CourseVideoSchema);