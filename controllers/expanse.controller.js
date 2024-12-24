import errorHandler from "../helpers/errorHandler.js";
import EXPANSES from "../models/expanses.model.js";

// Get all expanses with optional filters
export const getExpanses = async (req, res, next) => {
	try {
		const filters = req.query;
		const expanses = await EXPANSES.find(filters).populate("user");
		return res.status(200).json({
			message: "user expanses fetched",
			expanses,
		});
	} catch (error) {
		return next(errorHandler(404, error.message, error.cause, error.name));
	}
};

// Add a new expanse
export const addExpanse = async (req, res, next) => {
	try {
		const { user, title, content } = req.body;
		const newExpanse = new EXPANSES({ user, title, content });
		await newExpanse.save();
		return res.status(201).json(newExpanse);
	} catch (error) {
		return next(errorHandler(404, error.message, error.cause, error.name));
	}
};

// Modify an existing expanse
export const modifyExpanse = async (req, res, next) => {
	try {
		const { id } = req.params;
		const updatedExpanse = await EXPANSES.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		if (!updatedExpanse) {
			return res.status(404).json({ error: "Expanse not found" });
		}
		return res.status(200).json(updatedExpanse);
	} catch (error) {
		return next(errorHandler(404, error.message, error.cause, error.name));
	}
};

// Delete an expanse
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
