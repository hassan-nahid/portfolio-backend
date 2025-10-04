"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillRoutes = void 0;
const express_1 = require("express");
const CheckAuth_1 = require("../../middleware/CheckAuth");
const ValidateRequest_1 = require("../../middleware/ValidateRequest");
const skillCategory_validation_1 = require("./skillCategory.validation");
const skill_validation_1 = require("./skill.validation");
const skill_controller_1 = require("./skill.controller");
const multer_config_1 = require("../../config/multer.config");
const router = (0, express_1.Router)();
// Create skill category (protected route)
router.post("/category", (0, ValidateRequest_1.validateRequest)(skillCategory_validation_1.SkillCategoryValidation.createSkillCategoryValidationSchema), (0, CheckAuth_1.checkAuth)("OWNER"), skill_controller_1.skillControllers.createCategory);
// Get all skill categories (public route)
router.get("/category", skill_controller_1.skillControllers.getAllCategories);
// Get single skill category by ID (public route)
router.get("/category/:id", skill_controller_1.skillControllers.getCategoryById);
// Update skill category (protected route)
router.put("/category/:id", (0, ValidateRequest_1.validateRequest)(skillCategory_validation_1.SkillCategoryValidation.updateSkillCategoryValidationSchema), (0, CheckAuth_1.checkAuth)("OWNER"), skill_controller_1.skillControllers.updateCategory);
// Delete skill category (protected route)
router.delete("/category/:id", (0, CheckAuth_1.checkAuth)("OWNER"), skill_controller_1.skillControllers.deleteCategory);
// ====================== SKILL ROUTES ======================
// Create skill (protected route)
router.post("/", multer_config_1.multerUpload.single('logo'), (0, ValidateRequest_1.validateRequest)(skill_validation_1.SkillValidation.createSkillValidationSchema), (0, CheckAuth_1.checkAuth)("OWNER"), skill_controller_1.skillControllers.createSkill);
// Get all skills (public route)
router.get("/", skill_controller_1.skillControllers.getAllSkills);
// Get single skill by ID (public route)
router.get("/:id", skill_controller_1.skillControllers.getSkillById);
// Update skill (protected route)
router.put("/:id", multer_config_1.multerUpload.single('logo'), (0, ValidateRequest_1.validateRequest)(skill_validation_1.SkillValidation.updateSkillValidationSchema), (0, CheckAuth_1.checkAuth)("OWNER"), skill_controller_1.skillControllers.updateSkill);
// Delete skill (protected route)
router.delete("/:id", (0, CheckAuth_1.checkAuth)("OWNER"), skill_controller_1.skillControllers.deleteSkill);
exports.SkillRoutes = router;
