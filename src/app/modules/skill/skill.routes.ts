import { Router } from "express";
import { checkAuth } from "../../middleware/CheckAuth";
import { validateRequest } from "../../middleware/ValidateRequest";
import { SkillCategoryValidation } from "./skillCategory.validation";

const router = Router()


router.post("category", validateRequest(SkillCategoryValidation.createSkillCategoryValidationSchema),checkAuth("OWNER"))


export const SkillRoutes = router