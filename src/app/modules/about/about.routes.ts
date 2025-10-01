import express from "express";
import { AboutController } from "./about.controller";
import { checkAuth } from "../../middleware/CheckAuth";
import { validateRequest } from "../../middleware/ValidateRequest";
import { AboutValidation } from "./about.validation";
import { multerUpload } from "../../config/multer.config";

const router = express.Router();

// Create about section (only one allowed) - Protected route for OWNER
router.post(
  "/create",
  checkAuth("OWNER"),
  multerUpload.single("photo"),
  validateRequest(AboutValidation.createAboutValidationSchema),
  AboutController.createAbout
);

// Get about section (public route)
router.get("/", AboutController.getAbout);

// Get about section by ID (public route)
router.get(
  "/:id",
  AboutController.getAboutById
);

// Update about section by ID - Protected route for OWNER
router.patch(
  "/:id",
  checkAuth("OWNER"),
  multerUpload.single("photo"),
  validateRequest(AboutValidation.updateAboutValidationSchema),
  AboutController.updateAbout
);


// Delete about section by ID - Protected route for OWNER
router.delete(
  "/:id",
  checkAuth("OWNER"),
  AboutController.deleteAbout
);


export const AboutRoutes = router;
