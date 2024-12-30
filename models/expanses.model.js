import { Schema, model } from "mongoose";

const expansesSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "user" },
		title: String,
		content: String,
		category: {
			type: String,
			enum: [
				"Groceries",
				"Leisure",
				"Electronics",
				"Utilities",
				"Clothing",
				"Health",
				"Others",
			],
			required:true
		},
	},
	{ timestamps: true }
);

const EXPANSES = model("expanses", expansesSchema);
export default EXPANSES;
