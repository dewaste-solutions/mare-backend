export const formatCertificate = (certString: string): string => {
	// Unescape characters like \\n, \\, etc.
	const unescaped = certString
		.replace(/\\\\n/g, "\n") // replace \\n with real newlines
		.replace(/\\n/g, "\n") // also handle single escaped \n
		.replace(/\\/g, "") // remove stray backslashes
		.trim();

	// Remove headers and footers
	const base64Content = unescaped
		.replace(/-----BEGIN CERTIFICATE-----/g, "")
		.replace(/-----END CERTIFICATE-----/g, "")
		.replace(/\s+/g, ""); // remove all whitespace (newlines, spaces, etc.)

	// Split into lines of 64 characters
	const formattedBody = base64Content.match(/.{1,64}/g)?.join("\n") || "";

	// Rebuild with headers
	return `-----BEGIN CERTIFICATE-----\n${formattedBody}\n-----END CERTIFICATE-----`;
};
