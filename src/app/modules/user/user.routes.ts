import { Router } from 'express';
import { Request, Response } from 'express';
import { validateRequest } from '../../middleware/ValidateRequest';
import { createZodSchema, loginSchema } from './user.validation';
import { Usercontrollers } from './user.controller';
import { checkAuth } from '../../middleware/CheckAuth';

const router = Router();

// Example placeholder handlers (replace with your actual controller methods)
const placeholderHandler = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Handler not implemented yet' });
};

// Authentication routes
router.post(
  '/register',
  validateRequest(createZodSchema),
  checkAuth("OWNER"),
  Usercontrollers.createUser
);

router.post(
  '/login',
  validateRequest(loginSchema),
  Usercontrollers.credentialsLogin 
);

router.get("/me", checkAuth("OWNER"), Usercontrollers.getMe)




router.post("/refresh-token", Usercontrollers.getNewAccessToken)
router.post("/logout", Usercontrollers.logout)
router.patch("/change-password", checkAuth("OWNER"), Usercontrollers.changePassword)

export const UserRoutes = router;