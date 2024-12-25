import { Schema, model } from "mongoose";

const expansesSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "user" },
		title: String,
		content: String,
	},
	{ timestamps: true }
);

const EXPANSES = model("expanses", expansesSchema);
export default EXPANSES;