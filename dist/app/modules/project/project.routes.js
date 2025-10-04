"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRoutes = void 0;
const express_1 = require("express");
const CheckAuth_1 = require("../../middleware/CheckAuth");
const ValidateRequest_1 = require("../../middleware/ValidateRequest");
const project_validation_1 = require("./project.validation");
const project_controller_1 = require("./project.controller");
const multer_config_1 = require("../../config/multer.config");
const router = (0, express_1.Router)();
// Create project with image upload (protected route) - both routes for compatibility
router.post("/", (0, CheckAuth_1.checkAuth)("OWNER"), multer_config_1.multerUpload.single("image"), (0, ValidateRequest_1.validateRequest)(project_validation_1.ProjectValidation.createProjectValidationSchema), project_controller_1.projectControllers.createProject);
router.post("/create", (0, CheckAuth_1.checkAuth)("OWNER"), multer_config_1.multerUpload.single("image"), (0, ValidateRequest_1.validateRequest)(project_validation_1.ProjectValidation.createProjectValidationSchema), project_controller_1.projectControllers.createProject);
// Get all projects (public route)
router.get("/", project_controller_1.projectControllers.getAllProjects);
// Get single project by ID (public route)
router.get("/:id", project_controller_1.projectControllers.getProjectById);
// Update project with optional image upload (protected route)
router.put("/:id", (0, CheckAuth_1.checkAuth)("OWNER"), multer_config_1.multerUpload.single("image"), (0, ValidateRequest_1.validateRequest)(project_validation_1.ProjectValidation.updateProjectValidationSchema), project_controller_1.projectControllers.updateProject);
// Delete project (protected route)
router.delete("/:id", (0, CheckAuth_1.checkAuth)("OWNER"), project_controller_1.projectControllers.deleteProject);
exports.ProjectRoutes = router;
