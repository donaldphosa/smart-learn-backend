import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user';
import courseRouter from './routes/course';
import videoRouter from './routes/video';
import { MONGO_URI } from './config/db';
import fileUpload from 'express-fileupload';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}


const connectDb = () =>{
    mongoose.connect(MONGO_URI).then(()=>{
        console.log("DB connected successfully");
    }).catch((err)=>{
        console.log("error connecting to db"); 
    })
}
connectDb();

const corsOptions: cors.CorsOptions = {
    origin: '*', // or an array of allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(fileUpload());
app.use('/users',userRouter);
app.use('/courses',courseRouter);
app.use('/videos',videoRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
