import * as express from "express"
import { Server } from "http"
import { api } from "./api"

const app = express()
let server: Server | null = null

app.use("/api/v1", api)

export const launchServer = () =>
	new Promise(resolve => {
		server = app.listen(+process.env.PORT!, () => {
			console.log(`Server is ready and listening for requests`)
			resolve()
		})
	})

export const closeServer = () =>
	new Promise(resolve => {
		if (server) {
			server.close(() => {
				server = null
				console.log("Server is closed")
				resolve()
			})
		} else {
			resolve()
		}
	})
