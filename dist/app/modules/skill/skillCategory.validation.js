"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillCategoryValidation = void 0;
const zod_1 = require("zod");
// Create skill category validation
const createSkillCategoryValidationSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
});
// Update skill category validation
const updateSkillCategoryValidationSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').optional(),
});
exports.SkillCategoryValidation = {
    createSkillCategoryValidationSchema,
    updateSkillCategoryValidationSchema,
};
