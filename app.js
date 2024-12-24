import express from "express";
import router from "./routes/index.routes.js";

const app = express();
//essential middleware
app.use(express.json());

//my application routes
app.use("/api", router);

//error handler route
app.use("/", function errorRoute(err, req, res, next) {
	return res.status(err.statusCode).json({
		message: "ran into some error",
		error: {
			name: err.name,
			message: err.message,
			cause: err.cause,
		},
	});
});
export default app;
