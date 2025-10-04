"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutRoutes = void 0;
const express_1 = __importDefault(require("express"));
const about_controller_1 = require("./about.controller");
const CheckAuth_1 = require("../../middleware/CheckAuth");
const ValidateRequest_1 = require("../../middleware/ValidateRequest");
const about_validation_1 = require("./about.validation");
const multer_config_1 = require("../../config/multer.config");
const router = express_1.default.Router();
// Create about section (only one allowed) - Protected route for OWNER
router.post("/create", (0, CheckAuth_1.checkAuth)("OWNER"), multer_config_1.multerUpload.single("photo"), (0, ValidateRequest_1.validateRequest)(about_validation_1.AboutValidation.createAboutValidationSchema), about_controller_1.AboutController.createAbout);
// Get about section (public route)
router.get("/", about_controller_1.AboutController.getAbout);
// Get about section by ID (public route)
router.get("/:id", about_controller_1.AboutController.getAboutById);
// Update about section by ID - Protected route for OWNER
router.patch("/:id", (0, CheckAuth_1.checkAuth)("OWNER"), multer_config_1.multerUpload.single("photo"), (0, ValidateRequest_1.validateRequest)(about_validation_1.AboutValidation.updateAboutValidationSchema), about_controller_1.AboutController.updateAbout);
// Delete about section by ID - Protected route for OWNER
router.delete("/:id", (0, CheckAuth_1.checkAuth)("OWNER"), about_controller_1.AboutController.deleteAbout);
exports.AboutRoutes = router;
