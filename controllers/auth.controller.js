import { verify } from "argon2";
import isValidEmail from "../helpers/emailValidation.js";
import errorHandler from "../helpers/errorHandler.js";
import USER from "../models/user.model.js";
import { createJWT } from "../middlewares/authentication.js";
//authentication controller
export const signUserIn = async (req, res, next) => {
	if (req.body == undefined || Object.keys(req.body).length === 0) {
			return next(
				errorHandler(400, "missing credentials", "bad request", "Error")
			);
		}
	const { email, password } = req.body;
	if (email == null || password == null) {
		return next(
			errorHandler(
				400,
				"missing user credentials",
				"missing values",
				"Error"
			)
		);
	}
	if (!isValidEmail(email)) {
		return next(
			errorHandler(
				400,
				"missing user credentials",
				"invalid credentials",
				"Error"
			)
		);
	}
	//check if user exist in database
	try {
		const user = await USER.findOne({ email });
		console.log(user);
		if (!user) {
			return next(
				errorHandler(404, "user doesn't exist", "bad values", "Error")
			);
		}
		//password verification using argon2
		const isValidPassword = verify(user.password, password);
		if (isValidPassword) {
			return next(
				errorHandler(
					401,
					"missing user credentials",
					"invalid credentials",
					"Error"
				)
			);
		}
		const token = createJWT(user);
		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production", //to be true in production
			sameSite: "Strict",
			maxAge: 24 * 60 * 60 * 1000, // 1 day
		});
		return res.status(200).json({ message: "User signed in successfully" });
	} catch (error) {
		return next(errorHandler(401, error.message, error.cause, error.name));
	}
};
