import { model, Schema } from "mongoose";
import { Category, IProject } from "./project.inteface";

const projectSchema = new Schema<IProject>({
    title: { type: String, required: true },
    image: { type: String, required: false },
    category: { type: String, enum: Object.values(Category), required: true },
    description: { type: String, required: true },
    features: [{ type: String }], // Array of key features/highlights
    demoLink: { type: String },
    githubFrontend: { type: String },
    githubBackend: { type: String },
    githubFullStack: { type: String },
    stacks: [{ type: Schema.Types.ObjectId, ref: "Skill" }] 
},{
    timestamps: true,
    versionKey: false
})

export const Project = model<IProject>("Project", projectSchema)