"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillCategory = void 0;
const mongoose_1 = require("mongoose");
const SkillCategorySchema = new mongoose_1.Schema({
    title: { type: String, required: true },
});
exports.SkillCategory = (0, mongoose_1.model)("SkillCategory", SkillCategorySchema);
