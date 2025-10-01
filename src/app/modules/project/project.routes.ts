import { Router } from "express";
import { checkAuth } from "../../middleware/CheckAuth";
import { validateRequest } from "../../middleware/ValidateRequest";
import { ProjectValidation } from "./project.validation";
import { projectControllers } from "./project.controller";

const router = Router()

// Create project (protected route)
router.post("/create", 
    validateRequest(ProjectValidation.createProjectValidationSchema), 
    checkAuth("OWNER"), 
    projectControllers.createProject
)

// Get all projects (public route)
router.get("/", projectControllers.getAllProjects)

// Get single project by ID (public route)
router.get("/:id", projectControllers.getProjectById)

// Update project (protected route)
router.put("/:id", 
    validateRequest(ProjectValidation.updateProjectValidationSchema), 
    checkAuth("OWNER"), 
    projectControllers.updateProject
)

// Delete project (protected route)
router.delete("/:id", 
    checkAuth("OWNER"), 
    projectControllers.deleteProject
)

export const ProjectRoutes = router