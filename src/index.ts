import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user';
import courseRouter from './routes/course';
import videoRouter from './routes/video';
import { MONGO_URI } from './config/db';

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

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/users',userRouter);
app.use('/courses',courseRouter);
app.use('/videos',videoRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
