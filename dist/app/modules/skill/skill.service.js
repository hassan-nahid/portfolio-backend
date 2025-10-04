"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.skillServices = void 0;
const SkillCategory_model_1 = require("./SkillCategory.model");
const skill_model_1 = require("./skill.model");
const createCategory = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield SkillCategory_model_1.SkillCategory.create(Object.assign({}, payload));
    return category;
});
const getAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield SkillCategory_model_1.SkillCategory.find();
    return categories;
});
const getCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield SkillCategory_model_1.SkillCategory.findById(id);
    return category;
});
const updateCategory = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield SkillCategory_model_1.SkillCategory.findByIdAndUpdate(id, payload, { new: true });
    return category;
});
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield SkillCategory_model_1.SkillCategory.findByIdAndDelete(id);
    return category;
});
// Skill CRUD operations
const createSkill = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const skill = yield skill_model_1.Skill.create(Object.assign({}, payload));
    // Populate the category after creation
    yield skill.populate('category');
    return skill;
});
const getAllSkills = () => __awaiter(void 0, void 0, void 0, function* () {
    const skills = yield skill_model_1.Skill.find().populate('category');
    return skills;
});
const getSkillById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const skill = yield skill_model_1.Skill.findById(id).populate('category');
    return skill;
});
const updateSkill = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const skill = yield skill_model_1.Skill.findByIdAndUpdate(id, payload, { new: true }).populate('category');
    return skill;
});
const deleteSkill = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const skill = yield skill_model_1.Skill.findByIdAndDelete(id);
    return skill;
});
exports.skillServices = {
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
};
