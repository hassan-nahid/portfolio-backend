import { model, Schema } from "mongoose";
import { Category, IProject } from "./project.inteface";

const projectSchema = new Schema<IProject>({
    title: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, enum: Object.values(Category), required: true },
    description: { type: String, required: true },
    demoLink: { type: String },
    githubFrontend: { type: String },
    githubBackend: { type: String },
    stacks: [{ type: Schema.Types.ObjectId, ref: "Skill" }] 
})

export const Project = model<IProject>("Project", projectSchema)