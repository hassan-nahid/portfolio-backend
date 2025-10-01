import { model, Schema, Document } from "mongoose";

export interface IAbout extends Document {
    name: string,
    about: string,
    bio: string,
    experience: number,
    projects: number,
    photo: string,
    createdAt?: Date,
    updatedAt?: Date,
}

const aboutSchema = new Schema<IAbout>({
    name: {type: String, required: true, trim: true},
    about: {type: String, required: true, trim: true},
    bio: {type: String, required: true, trim: true},
    photo: {type: String, required: true},
    experience: {type: Number, required: true, min: 0},
    projects: {type: Number, required: true, min: 0},
}, {
    timestamps: true,
})

export const About = model<IAbout>("About", aboutSchema)