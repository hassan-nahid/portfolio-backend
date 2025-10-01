import { IProject } from "./project.inteface";
import { Project } from "./project.model";

const createProject = async (payload: Partial<IProject>) => {
    const project = await Project.create({
        ...payload
    })
    
    // Populate the stacks after creation
    await project.populate('stacks')
    return project
}

const getAllProjects = async () => {
    const projects = await Project.find().populate('stacks')
    return projects
}

const getProjectById = async (id: string) => {
    const project = await Project.findById(id).populate('stacks')
    return project
}

const updateProject = async (id: string, payload: Partial<IProject>) => {
    const project = await Project.findByIdAndUpdate(id, payload, { new: true }).populate('stacks')
    return project
}

const deleteProject = async (id: string) => {
    const project = await Project.findByIdAndDelete(id)
    return project
}

export const projectServices = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
}