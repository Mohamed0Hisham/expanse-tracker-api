import errorHandler from "../helpers/errorHandler.js";
import EXPANSES from "../models/expanses.model.js";

export const getExpanses = async (req, res, next) => {
	try {
		const filters = req.query;
		const expanses = await EXPANSES.find(filters)
			.populate({
				path: "user",
				select: "-password -createdAt -updatedAt -__v",
			})
			.select("-createdAt -updatedAt -__v")
			.lean();
		return res.status(200).json({
			message: "all expanses with users details are fetched",
			expanses,
		});
	} catch (error) {
		return next(errorHandler(404, error.message, error.cause, error.name));
	}
};
export const getUserExpanses = async (req, res, next) => {
	const user = req.params.id;
	const filters = { ...req.query, user };
	try {
		const expanses = await EXPANSES.find(filters);
		return res.status(200).json({
			message: "user expanses fetched",
			expanses,
		});
	} catch (error) {
		return next(errorHandler(404, error.message, error.cause, error.name));
	}
};

export const addExpanse = async (req, res, next) => {
	try {
		const { user, title, content } = req.body;
		const newExpanse = { user, title, content };
		const result = await EXPANSES.create(newExpanse);
		return res.status(201).json({ message: "new expanse added", result });
	} catch (error) {
		return next(errorHandler(404, error.message, error.cause, error.name));
	}
};

export const modifyExpanse = async (req, res, next) => {
	try {
		const { id } = req.params;
		const updatedExpanse = await EXPANSES.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		if (!updatedExpanse) {
			return res.status(404).json({ error: "Expanse not found" });
		}
		return res.status(200).json({message:"expanse modified",updatedExpanse});
	} catch (error) {
		return next(errorHandler(404, error.message, error.cause, error.name));
	}
};

export const deleteExpanses = async (req, res, next) => {
	try {
		const { id } = req.params;
		const deletedExpanse = await EXPANSES.findByIdAndDelete(id);
		if (!deletedExpanse) {
			return res.status(404).json({ error: "Expanse not found" });
		}
		return res
			.status(200)
			.json({ message: "Expanse deleted successfully" });
	} catch (error) {
		return next(errorHandler(404, error.message, error.cause, error.name));
	}
};
