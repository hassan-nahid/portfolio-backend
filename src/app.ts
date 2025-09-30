import cors from "cors"
import express, { Request, Response } from 'express';

import cookieParser from "cookie-parser";
import { envVars } from "./app/config/env";
import { router } from "./app/routers";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";

const app = express();


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set("trust proxy",1)
app.use(cors({
    origin: envVars.FRONTEND_URL,
    credentials: true
}))

app.use(cookieParser())




app.use("/api/v1", router)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Your System hacked!"
    })
})

app.use(globalErrorHandler)
app.use(notFound)

export default app