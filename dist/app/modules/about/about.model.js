"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.About = void 0;
const mongoose_1 = require("mongoose");
const aboutSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    about: { type: String, required: true, trim: true },
    bio: { type: String, required: true, trim: true },
    photo: { type: String, required: true },
    experience: { type: Number, required: true, min: 0 },
    projects: { type: Number, required: true, min: 0 },
}, {
    timestamps: true,
});
exports.About = (0, mongoose_1.model)("About", aboutSchema);
