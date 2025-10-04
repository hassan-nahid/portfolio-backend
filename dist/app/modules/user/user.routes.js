"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const ValidateRequest_1 = require("../../middleware/ValidateRequest");
const user_validation_1 = require("./user.validation");
const user_controller_1 = require("./user.controller");
const CheckAuth_1 = require("../../middleware/CheckAuth");
const router = (0, express_1.Router)();
// Example placeholder handlers (replace with your actual controller methods)
const placeholderHandler = (req, res) => {
    res.status(200).json({ message: 'Handler not implemented yet' });
};
// Authentication routes
router.post('/register', (0, ValidateRequest_1.validateRequest)(user_validation_1.createZodSchema), (0, CheckAuth_1.checkAuth)("OWNER"), user_controller_1.Usercontrollers.createUser);
router.post('/login', (0, ValidateRequest_1.validateRequest)(user_validation_1.loginSchema), user_controller_1.Usercontrollers.credentialsLogin);
router.get("/me", (0, CheckAuth_1.checkAuth)("OWNER"), user_controller_1.Usercontrollers.getMe);
router.post("/refresh-token", user_controller_1.Usercontrollers.getNewAccessToken);
router.post("/logout", user_controller_1.Usercontrollers.logout);
router.patch("/change-password", (0, CheckAuth_1.checkAuth)("OWNER"), user_controller_1.Usercontrollers.changePassword);
exports.UserRoutes = router;
