import { Router } from "express";
import { checkAuth } from "../../middleware/CheckAuth";
import { validateRequest } from "../../middleware/ValidateRequest";
import { ProjectValidation } from "./project.validation";

const router = Router()

router.post("/create",validateRequest(ProjectValidation.createProjectValidationSchema),checkAuth("OWNER"),)

export const ProjectRoutes = router