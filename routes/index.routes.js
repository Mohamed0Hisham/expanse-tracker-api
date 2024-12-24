import { Router } from "express";
import {
	createUsers,
	deleteUser,
	getUserByID,
	getUsers,
	updateUser,
} from "../controllers/user.controller.js";
import { signUserIn } from "../controllers/auth.controller.js";

const router = Router();

// authentication route
router.route("/signin", signUserIn);

//user routes
router.route("/users").get(getUsers);
router.route("/user/:id").get(getUserByID);
router.route("/user").post(createUsers);
router.route("/user/:id").put(updateUser);
router.route("/user/:id").delete(deleteUser);

export default router;
