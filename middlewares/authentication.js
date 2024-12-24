import jwt from "jsonwebtoken";

export const createJWT = (user) => {
	const token = jwt.sign(
		{ id: user.id, email: user.email },
		process.env.JWT_SECRET,
		{ expiresIn: "15m" }
	);
	return token;
};

const protect = (req, res, next) => {
	const bearer = req.headers.authorization;

	if (!bearer || !bearer.startsWith("Bearer ")) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	const [, token] = bearer.split(" ");
	if (!token) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		req.user = payload;
		return next();
	} catch (e) {
		console.error(e);
		return res.status(401).json({ error: "Unauthorized" });
	}
};

export default protect;
