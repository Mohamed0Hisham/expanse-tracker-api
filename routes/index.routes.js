import { Router } from "express";
import {
	createUsers,
	deleteUser,
	getUserByID,
	getUsers,
	updateUser,
} from "../controllers/user.controller.js";
import { signUserIn } from "../controllers/auth.controller.js";
import {
	addExpanse,
	deleteExpanses,
	getExpanses,
	getUserExpanses,
	modifyExpanse,
} from "../controllers/expanse.controller.js";
import protect from "../middlewares/authentication.js";

const router = Router();

// authentication route
router.route("/signin").post(signUserIn);

//user routes
router.route("/users/").get(getUsers);
router.route("/user/:id").get(getUserByID);
router.route("/user").post(createUsers);
router.route("/user/:id").put(updateUser);
router.route("/user/:id").delete(deleteUser);
//expanses route
router.route("/expanses/").get(getExpanses);
router.route("/expanses/:id").get(protect, getUserExpanses);
router.route("/expanse").post(protect,addExpanse);
router.route("/expanse/:id").put(protect, modifyExpanse);
router.route("/expanse/:id").delete(protect,deleteExpanses);
export default router;
