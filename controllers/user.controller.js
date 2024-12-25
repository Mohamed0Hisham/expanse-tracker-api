import { hash, argon2id } from "argon2";
import isValidEmail from "../helpers/emailValidation.js";
import errorHandler from "../helpers/errorHandler.js";
import USER from "../models/user.model.js";

export const getUsers = async (req, res, next) => {
	const filters = req.query;
	try {
		const users = await USER.find(filters, {
			password: 0,
			createdAt: 0,
			updatedAt: 0,
			__v: 0,
		}).lean();
		return res.status(200).json({ message: "users fetched", users });
	} catch (error) {
		return next(errorHandler(404, error.message, error.cause, error.name));
	}
};
export const getUserByID = async (req, res, next) => {
	const id = req?.params?.id;
	if (!id) {
		return next(
			errorHandler(400, "missing credentials", "bad request", "Error")
		);
	}
	try {
		const user = await USER.findById(id, {
			password: 0,
			createdAt: 0,
			updatedAt: 0,
			__v: 0,
		}).lean();
		return res.status(200).json({ message: "user fetched", user });
	} catch (error) {
		return next(errorHandler(404, error.message, error.cause, error.name));
	}
};
export const createUsers = async (req, res, next) => {
	const { name, email, password } = req?.body;
	if (name == undefined || password == undefined || email == undefined) {
		return next(
			errorHandler(400, "missing credentials", "bad request", "Error")
		);
	}
	if (!isValidEmail(email)) {
		return next(
			errorHandler(400, "missing credentials", "bad request", "Error")
		);
	}
	try {
		//check if the user already exist
		const isAlreadyExist = await USER.findOne({ email }, { password: 0 });
		if (isAlreadyExist != undefined) {
			return next(
				errorHandler(400, "duplicate value", "bad request", "Error")
			);
		}
		//hash password before saving
		const hashedPassword = await hash(password, {
			type: argon2id, // Use Argon2id for best resistance against attacks
			timeCost: 3, // Number of iterations
			memoryCost: 65536, // 64 MB memory
			parallelism: 2, // Use 2 threads
		});
		const newUser = {
			name,
			email,
			password: hashedPassword,
		};
		// it's time to save the user to the database
		const user = await USER.create(newUser);
		const { password: _, ...rest } = user._doc;
		return res.status(201).json({
			message: "user created successfully",
			user: rest,
		});
	} catch (error) {
		return next(errorHandler(404, error.message, error.cause, error.name));
	}
};
export const updateUser = async (req, res, next) => {
	const body = req.body;
	if (body == undefined || Object.keys(body).length === 0) {
		return next(
			errorHandler(400, "missing credentials", "bad request", "Error")
		);
	}
	if (body.password) {
		return next(
			errorHandler(401, "invalid update field", "bad request", "Error")
		);
	}
	if (body.email) {
		if (!isValidEmail(body.email)) {
			return next(
				errorHandler(400, "missing credentials", "bad request", "Error")
			);
		}
	}
	try {
		const updatedUser = await USER.findByIdAndUpdate(req.params.id, body, {
			new: true,
		}).select("-password");
		return res.status(200).json({
			message: "user updated",
			new: updatedUser,
		});
	} catch (error) {
		return next(errorHandler(404, error.message, error.cause, error.name));
	}
};
export const deleteUser = async (req, res, next) => {
	USER.findByIdAndDelete(req.params.id)
		.select("-password")
		.lean()
		.then((result) => {
			return res.status(200).json({
				message: "user deleted",
				result: result,
			});
		})
		.catch((error) => {
			return next(
				errorHandler(404, error.message, error.cause, error.name)
			);
		});
};
