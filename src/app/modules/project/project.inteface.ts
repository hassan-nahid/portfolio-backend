import { Types } from "mongoose";

export enum Category {
    WEB = "WEB",
    MOBILE = "MOBILE",
    DESKTOP = "DESKTOP",
}

export interface IProject {
    _id?: Types.ObjectId;
    title: string,
    image?: string,
    category: Category,
    description: string,
    features?: string[], // Array of key features/highlights
    demoLink?: string,
    githubFrontend?: string,
    githubBackend?: string,
    githubFullStack?: string,
    stacks: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}