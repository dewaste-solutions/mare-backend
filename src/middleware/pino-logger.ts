import morgan from "morgan";

const logFormat = ":date[iso] :method :url :status :response-time ms";

export function logger() {
	return morgan(logFormat, {
		stream: {
			write: (message: string) => {
				// biome-ignore lint/suspicious/noConsole:
				console.log(message.trim());
			},
		},
		skip: (_req, res) => res.statusCode >= 400,
	});
}
