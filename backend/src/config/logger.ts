export function logInfo(message: string, meta?: unknown) {
  // simple logger; replace with pino/winston as needed
  // eslint-disable-next-line no-console
  console.log(`[INFO] ${message}`, meta ?? '');
}

export function logError(message: string, meta?: unknown) {
  // eslint-disable-next-line no-console
  console.error(`[ERROR] ${message}`, meta ?? '');
}


