import { IepaasApiClient } from "@iepaas/js-client"

let iepaas: IepaasApiClient | null = null

export function getIepaas(): IepaasApiClient {
	if (!iepaas) {
		iepaas = new IepaasApiClient()
	}

	return iepaas
}
