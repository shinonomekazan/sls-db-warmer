import { RDSDataService, AWSError } from "aws-sdk";

export async function warmDatabases(databaseCreds: {
	[databaseName: string]: {
		secretArn: string;
		resourceArn: string;
		region: string;
		credentials?: {
			accessKeyId: string;
			secretAccessKey: string;
		};
	};
}): Promise<void> {
	const queryDatabasePromises = Object.keys(databaseCreds).map((database) => {
		const { region, secretArn, resourceArn, credentials } = databaseCreds[database];
		const requestParams: RDSDataService.ExecuteStatementRequest = {
			database,
			resourceArn,
			secretArn,
			sql: "SELECT 1",
		};

		const rdsDataServiceConfig: RDSDataService.ClientConfiguration = { region, apiVersion: "latest" };
		if (credentials) rdsDataServiceConfig.credentials = credentials;

		const rdsdataservice = new RDSDataService(rdsDataServiceConfig);
		return rdsdataservice
			.executeStatement(requestParams)
			.promise()
			.catch((e: AWSError) => console.error(`Warm query to ${database} failed: ${e}`));
	});

	await Promise.all(queryDatabasePromises);
}