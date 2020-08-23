# sls-db-warmer
TS package that uses the data API to query AWS Aurora Serverless databases &amp; prevent auto pause.

## Usage

Invocation of `sls-db-warmer` should be scheduled according to how long your Aurora Serverless database is configured to wait before automatically pausing.

See [sls-db-warmer-template](https://github.com/shinonomekazan/sls-db-warmer-template) for example use with scheduled lambdas using Serverless Framework.

```
import { warmDatabases } from "sls-db-warmer";

const databasesToWarm = {
	[firstDbName]: {
		secretArn: "",
		resourceArn: "",
		region: "",
		credentials: {
			accessKeyId: "",
			secretAccessKey: "",
		},
	},
	[secondDbName]: {
		...
	}
};

await warmDatabases(databasesToWarm);
```