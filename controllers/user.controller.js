import { hash, argon2id } from "argon2";
import isValidEmail from "../helpers/emailValidation.js";
import errorHandler from "../helpers/errorHandler.js";
import USER from "../models/user.model.js";

export const getUsers = async (req, res, next) => {
	const filters = req.query;
	try {
		const users = await USER.find(filters);
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
		const user = await USER.findById(id);
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
		const isAlreadyExist = await USER.findOne({email})
		if(isAlreadyExist != undefined){
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
		return res.status(201).json({
			message: "user created successfully",
			user,
		});
	} catch (error) {
		return next(errorHandler(404, error.message, error.cause, error.name));
	}
};
export const updateUser = async (req, res, next) => {
	if (!req.body) {
		return next(
			errorHandler(400, "missing credentials", "bad request", "Error")
		);
	}
	if (req.body.password) {
		return next(
			errorHandler(401, "invalid update field", "bad request", "Error")
		);
	}
	if (req.body.email) {
		if (!isValidEmail(req.body.email)) {
			return next(
				errorHandler(400, "missing credentials", "bad request", "Error")
			);
		}
	}
	try {
		const updatedUser = await USER.findByIdAndUpdate(req.params.id, {
			new: true,
		});
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
