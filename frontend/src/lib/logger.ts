export type AuditEvent = {
	action: string;
	component?: string;
	metadata?: Record<string, unknown>;
	timestamp: string;
	userAgent?: string;
	route?: string;
};

type AuditEventInput = Omit<AuditEvent, "timestamp" | "userAgent" | "route"> &
	Partial<Pick<AuditEvent, "timestamp" | "userAgent" | "route">>;

const LOG_ENDPOINT = "/api/logs";
const isBrowser = typeof window !== "undefined";
const eventQueue: AuditEvent[] = [];
let flushScheduled = false;

declare global {
	interface Window {
		__zinovaAuditErrorHandlersAttached__?: boolean;
	}
}

function enrichEvent(event: AuditEventInput): AuditEvent {
	return {
		...event,
		timestamp: event.timestamp ?? new Date().toISOString(),
		route: event.route ?? (isBrowser ? window.location.pathname : undefined),
		userAgent: event.userAgent ?? (isBrowser ? navigator.userAgent : undefined),
	};
}

function scheduleFlush(): void {
	if (flushScheduled) {
		return;
	}

	flushScheduled = true;

	if (typeof queueMicrotask === "function") {
		queueMicrotask(flushQueue);
		return;
	}

	setTimeout(flushQueue, 0);
}

function flushQueue(): void {
	flushScheduled = false;

	if (!eventQueue.length) {
		return;
	}

	const events = eventQueue.splice(0, eventQueue.length);

	if (import.meta.env.DEV) {
		events.forEach((event) => {
			console.log("[AUDIT]", event);
		});
		return;
	}

	events.forEach((event) => {
		void fetch(LOG_ENDPOINT, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(event),
		}).catch(() => {
			// Fail silently to avoid impacting UI.
		});
	});
}

export function logEvent(event: AuditEvent): void;
export function logEvent(event: AuditEventInput): void;
export function logEvent(event: AuditEventInput): void {
	eventQueue.push(enrichEvent(event));
	scheduleFlush();
}

export function logUserAction(
	action: string,
	metadata: Record<string, unknown> = {},
	component?: string
): void {
	logEvent({ action, metadata, component });
}

export function logApiCall(
	endpoint: string,
	status: "START" | "SUCCESS" | "FAILED",
	metadata: Record<string, unknown> = {},
	component = "API"
): void {
	logEvent({
		action: "API_CALL",
		component,
		metadata: {
			endpoint,
			status,
			...metadata,
		},
	});
}

export function logError(
	error: unknown,
	context: Record<string, unknown> = {},
	component?: string
): void {
	const errorObject = error instanceof Error ? error : undefined;
	const errorMessage =
		errorObject?.message ?? (typeof error === "string" ? error : "Unknown error");
	const action = typeof error === "string" && error.trim() ? error : "ERROR";

	logEvent({
		action,
		component,
		metadata: {
			...context,
			errorName: errorObject?.name,
			errorMessage,
			errorStack: errorObject?.stack,
		},
	});
}

export function setupGlobalErrorLogging(): void {
	if (!isBrowser || window.__zinovaAuditErrorHandlersAttached__) {
		return;
	}

	window.__zinovaAuditErrorHandlersAttached__ = true;

	window.addEventListener("error", (event) => {
		logError(
			event.error ?? event.message,
			{
				channel: "window.onerror",
				source: event.filename,
				line: event.lineno,
				column: event.colno,
			},
			"GlobalErrorHandler"
		);
	});

	window.addEventListener("unhandledrejection", (event) => {
		logError(
			event.reason,
			{ channel: "window.unhandledrejection" },
			"GlobalErrorHandler"
		);
	});
}
