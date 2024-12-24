import { configDotenv } from "dotenv";
import app from "./app.js";
import { connect } from "mongoose";
configDotenv();

connect(process.env.DB_URI, {
	dbName: "expanse app",
}).then(() => {
	app.listen(process.env.PORT, () =>
		console.log("🚀 server is running, DB is connected ✅")
	);
});
