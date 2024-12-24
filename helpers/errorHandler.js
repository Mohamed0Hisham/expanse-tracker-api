export default function errorHandler(code, msg, cause, name) {
	const Name = name || "undefined error";
	const message = msg || "internal server error";
	const Cause = cause || "coudn't determine";
	const error = new Error(message, { cause: Cause });
	error.name = Name;
	error.statusCode = code || 500;
	return error;
}
