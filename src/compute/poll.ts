export interface PollOptions {
	retryIntervalInSeconds: number
	maxTries: number
}

export async function poll<T>(
	predicate: (retry: symbol) => Promise<T>,
	options: PollOptions
): Promise<T> {
	const retrySymbol = Symbol("poll-retry")
	const performAttempt: (n: number) => Promise<T> = async attemptNumber => {
		try {
			return await predicate(retrySymbol)
		} catch (e) {
			if (e === retrySymbol) {
				if (attemptNumber === options.maxTries) {
					throw new Error("Polling max tries exceeded")
				} else {
					await new Promise(r =>
						setTimeout(r, options.retryIntervalInSeconds * 1000)
					)
					return await performAttempt(attemptNumber + 1)
				}
			} else {
				throw e
			}
		}
	}

	return await performAttempt(1)
}
