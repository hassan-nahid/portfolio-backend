"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const mongoose_1 = require("mongoose");
const project_inteface_1 = require("./project.inteface");
const projectSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    image: { type: String, required: false },
    category: { type: String, enum: Object.values(project_inteface_1.Category), required: true },
    description: { type: String, required: true },
    features: [{ type: String }], // Array of key features/highlights
    demoLink: { type: String },
    githubFrontend: { type: String },
    githubBackend: { type: String },
    githubFullStack: { type: String },
    stacks: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Skill" }]
}, {
    timestamps: true,
    versionKey: false
});
exports.Project = (0, mongoose_1.model)("Project", projectSchema);
