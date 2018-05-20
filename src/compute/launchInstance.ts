import { getEC2 } from "./getEC2"
import { poll } from "./poll"
import {oneLine} from "common-tags"

export async function launchComputeInstance(command: string) {
	const { LOG_TRANSMISSION_ADDRESS, LOG_TRANSMISSION_PORT_CORE } = process.env

	const logTransmissionCommand =
		(LOG_TRANSMISSION_ADDRESS && LOG_TRANSMISSION_PORT_CORE)
			? ` 2>&1 | nc ${LOG_TRANSMISSION_ADDRESS} ${LOG_TRANSMISSION_PORT_CORE}`
			: ""

	const id = await runInstance(
		oneLine`sudo docker run
			-e DATABASE_URL="${process.env.DATABASE_URL}"
			"${process.env.DOCKER_REPO}"
			"${command}"${logTransmissionCommand}`
	)
	await waitForInstanceRunning(id)
}

export const runInstance = (command: string) =>
	new Promise<string>((resolve, reject) =>
		getEC2().runInstances(
			{
				ImageId: process.env.AWS_AMI_ID!,
				InstanceType: "t2.nano",
				MinCount: 1,
				MaxCount: 1,
				TagSpecifications: [
					{
						ResourceType: "instance",
						Tags: [
							{
								Key: "Name",
								Value: "DaaS Machine"
							}
						]
					}
				],
				UserData: new Buffer(
					[
						"#!/bin/bash",
						// Assign a TTL to the instance. If it lives longer than
						// that, kill it. +180 = 3 hours
						"sudo shutdown -P +180",
						command,
						"sudo shutdown now"
					].join("\n"),
					"utf-8"
				).toString("base64"),
				InstanceInitiatedShutdownBehavior: "terminate"
			},
			(err, data) => {
				if (
					err ||
					!data.Instances ||
					data.Instances.filter(it => !it.InstanceId).length > 0
				) {
					reject(err)
				} else {
					resolve(data.Instances[0].InstanceId)
				}
			}
		)
	)

export const waitForInstanceRunning = (instanceId: string) =>
	poll(
		retry =>
			new Promise<void>((resolve, reject) =>
				getEC2().describeInstances(
					{
						InstanceIds: [instanceId]
					},
					(err, data) => {
						if (err) {
							reject(err)
						} else {
							if (
								data.Reservations![0].Instances![0].State!.Name === "running"
							) {
								resolve()
							} else {
								reject(retry)
							}
						}
					}
				)
			),
		{
			retryIntervalInSeconds: 1,
			maxTries: 60
		}
	)
