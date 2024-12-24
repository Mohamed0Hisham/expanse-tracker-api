export default function isValidEmail(email) {
	// Check if the email is a string
	if (typeof email !== "string") {
		return false;
	}

	// Split the email into local part and domain part
	const atSymbolIndex = email.indexOf("@");
	if (atSymbolIndex === -1 || email.indexOf("@", atSymbolIndex + 1) !== -1) {
		return false; // Must contain exactly one '@'
	}

	const localPart = email.slice(0, atSymbolIndex);
	const domainPart = email.slice(atSymbolIndex + 1);

	// Check local part length
	if (localPart.length === 0 || localPart.length > 64) {
		return false;
	}

	// Check domain part length
	if (domainPart.length === 0 || domainPart.length > 253) {
		return false;
	}

	// Check for invalid characters in local part
	const validLocalChars = new Set(
		"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&'*+/=?^_`{|}~.-"
	);
	for (let char of localPart) {
		if (!validLocalChars.has(char)) {
			return false;
		}
	}

	// Check for invalid characters in domain part
	const validDomainChars = new Set(
		"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-"
	);
	for (let char of domainPart) {
		if (!validDomainChars.has(char)) {
			return false;
		}
	}

	// Split domain part into labels
	const domainLabels = domainPart.split(".");

	// Check each label in the domain part
	for (let label of domainLabels) {
		if (label.length === 0 || label.length > 63) {
			return false;
		}
		if (label[0] === "-" || label[label.length - 1] === "-") {
			return false;
		}
		if (label.includes("--")) {
			return false;
		}
		if (label.startsWith(".") || label.endsWith(".")) {
			return false; // Labels cannot start or end with a dot
		}
	}

	// Additional check for local part
	if (localPart.startsWith(".") || localPart.endsWith(".")) {
		return false; // Local part cannot start or end with a dot
	}

	return true;
}
