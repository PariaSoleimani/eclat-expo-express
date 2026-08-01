export class HttpError extends Error {
	constructor(status, message) {
		super(message);
		this.name = 'HttpError';
		this.status = status;
		this.timestamp = new Date().toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false,
		});
	}
}
