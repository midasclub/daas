/**
 * Similar to setInterval, except it waits for the function to finish before
 * beginning the wait before the next execution, like this:
 *
 * Considering that the wait is of 1000ms and the async function takes 200ms:
 *
 * 1. Async function is executed (0ms)
 * 2. Async function finishes (200ms)
 * 3. Wait begins (1200ms)
 * 4. Async function is executed (1200ms)
 * etc
 *
 * @param predicate An async function that will be executed periodically
 * @param waitMilliseconds The number of milliseconds to wait before
 * the next execution
 */
export function setNonOverlappingInterval(
	predicate: () => Promise<any>,
	waitMilliseconds: number
) {
	async function tick() {
		await predicate()
		await new Promise(r => setTimeout(r, waitMilliseconds))
		tick().catch(console.error)
	}

	tick().catch(console.error)
}
