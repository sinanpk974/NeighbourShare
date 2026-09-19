import express from 'express'
import dotenv from 'dotenv'
import connection from "./connection.js";
import router from './router.js';
import cors from "cors";

dotenv.config()

const app = express()

app.use(cors());
app.use(express.json({limit:"50mb"}))

app.use('/api',router)

connection().then(()=>{
  app.listen(process.env.PORT,()=>{
  console.log(`server running http://localhost:${process.env.PORT}`);
  
})
}).catch((err)=>{
    console.log(err);
    
})
