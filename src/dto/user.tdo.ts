import { courseDTO } from "./course.dto";

// complete later
export interface UserDTO {
    username: string;
    password: string;
    email?: string;
    enrolledCourses?:courseDTO[];
    name:string;
    surname:string;
    DoB?:string;
    idNumber?:string;
}

export interface SignupDTO {
    username: string;
    password: string;
    email: string;
    name:string;
    surname:string;
}

export interface LoginDTO {
    email: string,
    password: string
}

export interface UpdateUserDTO {
    username?: string;
    email?: string;
    enrolledCourses?:string[];
    name:string;
    surname:string;
    DoB?:string;
    idNumber?:string;
}
