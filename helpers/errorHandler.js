export default function errorHandler(code, msg, cause, name) {
	const statusCode = code || 500;
	const name = name || "undefined error";
	const message = msg || "internal server error";
	const cause = cause || "coudn't determine";
	const error = new Error(message, { cause: cause });
	error.name = name;
	error.code = statusCode;
	return error;
}
