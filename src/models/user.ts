
import mongoose, { Document, Schema } from 'mongoose';
import course from './course';
import { courseDTO } from '../dto/course.dto';

export interface User extends Document {
    username: string;
    password: string;
    email: string;
    salt: string;
    name: string;
    surname: string;
    DoB?: string;
    enrolledCourses?: mongoose.Types.ObjectId[]; // Array of ObjectIds referencing Course
    idNumber?: string;
}

const userSchema = new Schema<User>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    salt: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    DoB: { type: String },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // Reference to Course model
    idNumber: { type: String }
}, { timestamps: true });


userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password; 
    delete userObject.__v; 
    delete userObject.salt;
    delete userObject.createdAt;
    delete userObject.updatedAt;

    return userObject;
};

const UserModel = mongoose.model<User>('User', userSchema);
export default UserModel;
