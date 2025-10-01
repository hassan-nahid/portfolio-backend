import { ISkillCategory, SkillCategory } from "./SkillCategory.model"
import { ISkill, Skill } from "./skill.model"

const createCategory = async (payload: Partial<ISkillCategory>) => {
    const category = await SkillCategory.create({
        ...payload
    })
    
    return category
}

const getAllCategories = async () => {
    const categories = await SkillCategory.find()
    return categories
}

const getCategoryById = async (id: string) => {
    const category = await SkillCategory.findById(id)
    return category
}

const updateCategory = async (id: string, payload: Partial<ISkillCategory>) => {
    const category = await SkillCategory.findByIdAndUpdate(id, payload, { new: true })
    return category
}

const deleteCategory = async (id: string) => {
    const category = await SkillCategory.findByIdAndDelete(id)
    return category
}

// Skill CRUD operations
const createSkill = async (payload: Partial<ISkill>) => {
    const skill = await Skill.create({
        ...payload
    })
    
    // Populate the category after creation
    await skill.populate('category')
    return skill
}

const getAllSkills = async () => {
    const skills = await Skill.find().populate('category')
    return skills
}

const getSkillById = async (id: string) => {
    const skill = await Skill.findById(id).populate('category')
    return skill
}

const updateSkill = async (id: string, payload: Partial<ISkill>) => {
    const skill = await Skill.findByIdAndUpdate(id, payload, { new: true }).populate('category')
    return skill
}

const deleteSkill = async (id: string) => {
    const skill = await Skill.findByIdAndDelete(id)
    return skill
}

export const skillServices = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    createSkill,
    getAllSkills,
    getSkillById,
    updateSkill,
    deleteSkill
}