import { Schema, model } from "mongoose";

const userSchema = new Schema(
	{
		name: {
			firstname: String,
			lastname: String,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
			minLength: 6,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);
const USER = model("user", userSchema);
export default USER;
