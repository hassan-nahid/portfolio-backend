import { IProject } from "./project.inteface";
import { Project } from "./project.model";

const createProject = async (payload: Partial<IProject>) => {

    const user = await Project.create({
        ...payload
    })
    return user
}

export const projectServices = {
    createProject
}