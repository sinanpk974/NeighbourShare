import dotenv from "dotenv"
import pkg from 'jsonwebtoken'
const {verify}=pkg;

dotenv.config()

export async function Auth(req,res,next) {
    try{
        const key = req.headers.authorization
        if(!key){
            return res.status(401).send("unauthorized access")
        }
        const token = key.split(" ")[1]
        const auth = verify (token,process.env.JWT_KEY)
        req.user = auth
        next()
    }catch (error){
      return res.status(500).send(error)
    }
}