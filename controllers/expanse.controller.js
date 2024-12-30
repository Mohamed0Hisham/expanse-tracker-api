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
	try {
		// Extract parameters
		const userId = req.params.id;
		const { date, category } = req.query;

		// Validate user id
		if (!userId) {
			return res.status(400).json({ message: "User ID is required." });
		}

		// Initialize filters
		const filters = { user: userId };
		const now = new Date();

		// Apply date filter
		if (date) {
			const targetTime = new Date();
			if (date === "pastweek") {
				targetTime.setDate(now.getDate() - 7);
			} else if (date === "lastmonth") {
				targetTime.setMonth(now.getMonth() - 1);
			} else if (date === "last3months") {
				targetTime.setMonth(now.getMonth() - 3);
			} else {
				return res
					.status(400)
					.json({ message: "Invalid date filter." });
			}
			filters.createdAt = { $gte: targetTime };
		}

		// Apply category filter
		if (category) {
			filters.category = category;
		}

		// // Fetch expanses with pagination
		// const page = parseInt(req.query.page, 10) || 1;
		// const limit = parseInt(req.query.limit, 10) || 10;
		// const skip = (page - 1) * limit;

		// const expanses = await EXPANSES.find(filters).skip(skip).limit(limit);
		const expanses = await EXPANSES.find(filters).lean();

		// Return response
		return res.status(200).json({
			message: "User expanses fetched successfully.",
			total: expanses.length,
			expanses,
		});
	} catch (error) {
		return next(errorHandler(500, error.message, error.cause, error.name));
	}
};

export const addExpanse = async (req, res, next) => {
	try {
		const { user, title, content, category } = req.body;
		const newExpanse = { user, title, content, category };
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
		return res
			.status(200)
			.json({ message: "expanse modified", updatedExpanse });
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
