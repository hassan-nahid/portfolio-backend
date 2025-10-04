"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skill = exports.SkillLevel = void 0;
const mongoose_1 = require("mongoose");
var SkillLevel;
(function (SkillLevel) {
    SkillLevel["BEGINNER"] = "Beginner";
    SkillLevel["INTERMEDIATE"] = "Intermediate";
    SkillLevel["EXPERIENCED"] = "Experienced";
    SkillLevel["EXPERT"] = "Expert";
    SkillLevel["GOOD"] = "Good";
    SkillLevel["STRONG"] = "Strong";
    SkillLevel["EXCELLENT"] = "Excellent";
})(SkillLevel || (exports.SkillLevel = SkillLevel = {}));
const SkillSchema = new mongoose_1.Schema({
    skill: { type: String, required: true },
    level: {
        type: String,
        required: true,
        enum: Object.values(SkillLevel)
    },
    logo: { type: String, required: false },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: "SkillCategory" },
});
exports.Skill = (0, mongoose_1.model)("Skill", SkillSchema);
