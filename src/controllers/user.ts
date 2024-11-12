import { Request, Response, NextFunction } from "express";
import { LoginDTO, SignupDTO, UpdateUserDTO, UserDTO } from "../dto/user.tdo";
import UserModel from "../models/user";
import { comparePasswords, generateSalt, hashPassword } from "../utility/passwordutility";
import { generateToken } from "../utility/jwtUtil";
import { Types } from 'mongoose';

export const signup = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { email, password, username, name, surname } = <SignupDTO>req.body;

        if (!username) {
            res.status(400).json({ message: 'Username is required.' });
            return;
        }
        if (!email) {
            res.status(400).json({ message: 'email is required.' });
            return;
        }
        if (!password) {
            res.status(400).json({ message: 'password is required.' });
            return;
        }

        if (!surname) {
            return res.status(400).json({ message: 'surname is required.' });
        }

        if (!name) {
            return res.status(400).json({ message: 'name is required.' });
        }

        const existingUser = await UserModel.findOne({ email: email });

        if (existingUser) {
            return res.status(500).json({ message: "user already exist", success: false })
        } 

        const salt = await generateSalt();

        const hashedPassword = await hashPassword(password, salt);

        const newUser = await UserModel.create({ username, email, password: hashedPassword, salt: salt, name, surname });

        newUser.save();

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        res.status(500).json({ message: "user not created", success: false, error: err })
    }

}

export const login = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { email, password } = <LoginDTO>req.body;

        if (!email) {
            res.status(400).json({ message: 'email is required.' });
            return;
        }
        if (!password) {
            res.status(400).json({ message: 'password is required.' });
            return;
        }

        const user = await UserModel.findOne({ email: email });

        if (!user) {
            return res.status(500).json({ message: "user not found", success: false })
        }

        const isValidPassword = await comparePasswords(password, user.password)

        if (!isValidPassword) {
            return res.status(500).json({ message: "invalid password", success: false });
        }

        const token = generateToken(user);

        return res.status(200).json({ message: 'User logged in successfully', success: true, token: token });
    } catch (err) {
        res.status(500).json({ message: "user not created", success: false, error: err })
    }
}

// implement later when you  have a good understanding of JWT and cookie sessions
export const logout = async (req: Request, res: Response, next: NextFunction) => {


}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // find provided details by user
        const newUserDetails = <UpdateUserDTO>req.body;
        
        // merge new details with existing user details
        const updatedDetails = { ...req.user, ...newUserDetails };

        const email = req.user?.user?.email;

        if (!email) {
            return res.status(400).json({ message: 'User not found in request.', success: false });
        }

        const updatedUser = await UserModel.findOneAndUpdate(
            { email: email },
            updatedDetails,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.', success: false });
        }

        res.status(200).json({ message: 'User updated successfully', success: true, user: updatedUser });

    } catch (err) {
        res.status(500).json({ message: 'An error occurred while updating the user.', success: false, error: err });
    }
}

export const purchaseCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = req.params.id;
        const email = req.user?.user.email;

        const user = await UserModel.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found." });
        }

        if (!Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ success: false, message: "Invalid course ID." });
        }

        const courseObjectId = new Types.ObjectId(courseId);

        if (user.enrolledCourses?.includes(courseObjectId)) {
            return res.status(400).json({
                success: false,
                message: "User is already enrolled in this course."
            });
        }

        user.enrolledCourses?.push(courseObjectId);
        await user.save();

        return res.status(200).json({
            message: "Course purchased successfully",
            success: true
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Error purchasing the course", error: error || error });
    }
};
