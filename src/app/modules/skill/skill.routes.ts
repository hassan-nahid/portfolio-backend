import { Router } from "express";
import { checkAuth } from "../../middleware/CheckAuth";
import { validateRequest } from "../../middleware/ValidateRequest";
import { SkillCategoryValidation } from "./skillCategory.validation";
import { SkillValidation } from "./skill.validation";
import { skillControllers } from "./skill.controller";
import { multerUpload } from "../../config/multer.config";

const router = Router()

// Create skill category (protected route)
router.post("/category", 
    validateRequest(SkillCategoryValidation.createSkillCategoryValidationSchema),
    checkAuth("OWNER"),
    skillControllers.createCategory
)

// Get all skill categories (public route)
router.get("/category", skillControllers.getAllCategories)

// Get single skill category by ID (public route)
router.get("/category/:id", skillControllers.getCategoryById)

// Update skill category (protected route)
router.put("/category/:id", 
    validateRequest(SkillCategoryValidation.updateSkillCategoryValidationSchema),
    checkAuth("OWNER"),
    skillControllers.updateCategory
)

// Delete skill category (protected route)
router.delete("/category/:id", 
    checkAuth("OWNER"),
    skillControllers.deleteCategory
)

// ====================== SKILL ROUTES ======================

// Create skill (protected route)
router.post("/", 
    multerUpload.single('logo'),
    validateRequest(SkillValidation.createSkillValidationSchema),
    checkAuth("OWNER"),
    skillControllers.createSkill
)

// Get all skills (public route)
router.get("/", skillControllers.getAllSkills)

// Get single skill by ID (public route)
router.get("/:id", skillControllers.getSkillById)

// Update skill (protected route)
router.put("/:id", 
    multerUpload.single('logo'),
    validateRequest(SkillValidation.updateSkillValidationSchema),
    checkAuth("OWNER"),
    skillControllers.updateSkill
)

// Delete skill (protected route)
router.delete("/:id", 
    checkAuth("OWNER"),
    skillControllers.deleteSkill
)

export const SkillRoutes = router