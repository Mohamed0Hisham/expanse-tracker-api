import app from "./app.js";
import { connect } from "mongoose";

connect(process.env.DB_URI, {
	dbName: "expanseApp",
}).then(() => {
	app.listen(process.env.PORT, () =>
		console.log("🚀 server is running, DB is connected ✅")
	);
});
