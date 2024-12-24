import express from "express";
import router from "./routes/index.routes.js";
import { configDotenv } from "dotenv";
configDotenv(); //ennvironment varaibles

const app = express();
//essential middleware
app.use(express.json());

//my application routes
app.use("/api", router);

//error handler route
app.use("/", function errorRoute(err, req, res, next) {
	const { statusCode, name, message, cause } = err;
	return res.status(statusCode).json({
		message: "ran into some error",
		error: {
			name: name,
			message: message,
			cause: cause,
		},
	});
});
export default app;
