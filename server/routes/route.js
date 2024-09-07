import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  //   creteUser,
  updateUser,
  updateNameOfUser,
  deleteUser,
  logoutUser,
} from "../controller/user.controller.js";
import { authenticateToken } from "../middleware/middleware.auth.js";

const router = express.Router();

router.get("/get-all-users", authenticateToken, getAllUsers);
// router.post("/add-user", authenticateToken, creteUser);
router.put("/update-user/:userEmail", authenticateToken, updateUser);
router.put("/update-user-name/:userEmail", authenticateToken, updateNameOfUser);
router.delete("/delete-User/:userEmail", authenticateToken, deleteUser);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
export default router;
