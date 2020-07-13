import { RDSDataService, AWSError } from "aws-sdk";

export async function warmDatabases(databaseCreds: {
	[databaseName: string]: {
		secretArn: string;
		resourceArn: string;
		region: string;
	};
}): Promise<void> {
	const queryDatabasePromises = Object.keys(databaseCreds).map((database) => {
		const { region, secretArn, resourceArn } = databaseCreds[database];
		const rdsdataservice = new RDSDataService({ region, apiVersion: "latest" });
		const requestParams: RDSDataService.ExecuteStatementRequest = {
			database,
			resourceArn,
			secretArn,
			sql: "SELECT 1",
		};

		return rdsdataservice
			.executeStatement(requestParams)
			.promise()
			.catch((e: AWSError) => console.error(`Warm query to ${database} failed: ${e}`));
	});

	await Promise.all(queryDatabasePromises);
}
