import { Router } from "express";
import { checkAuth } from "../../middleware/CheckAuth";
import { validateRequest } from "../../middleware/ValidateRequest";
import { ProjectValidation } from "./project.validation";
import { projectControllers } from "./project.controller";
import { multerUpload } from "../../config/multer.config";

const router = Router()

// Create project with image upload (protected route) - both routes for compatibility
router.post("/", 
    checkAuth("OWNER"),
    multerUpload.single("image"),
    validateRequest(ProjectValidation.createProjectValidationSchema), 
    projectControllers.createProject
)

router.post("/create", 
    checkAuth("OWNER"),
    multerUpload.single("image"),
    validateRequest(ProjectValidation.createProjectValidationSchema), 
    projectControllers.createProject
)

// Get all projects (public route)
router.get("/", projectControllers.getAllProjects)

// Get single project by ID (public route)
router.get("/:id", projectControllers.getProjectById)

// Update project with optional image upload (protected route)
router.put("/:id", 
    checkAuth("OWNER"),
    multerUpload.single("image"),
    validateRequest(ProjectValidation.updateProjectValidationSchema), 
    projectControllers.updateProject
)

// Delete project (protected route)
router.delete("/:id", 
    checkAuth("OWNER"), 
    projectControllers.deleteProject
)

export const ProjectRoutes = router