import * as AWS from "aws-sdk"

export const getEC2 = () => new AWS.EC2({ apiVersion: "2016-11-15" })
