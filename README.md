# Downloader API Service

> This is a experiment where i attempt to download **1 million** images/files under **60 seconds**.

## Experiment results

### Parameters
 - Lambda instance max concurrency: **1000** (can be increased)  
 - Image average size: **1.7MB**  
 - Number of concurrent downloads per lambda instance: **100**

### Result

Total size: **~1700GB**  
Total time: **29 seconds**

-----------------------------------------------------------

## Details
For the sake of this experiment, i only downloaded the images to the lambda function ephemeral storage.  
I could've uploaded to S3 or EFS but what i wanted to know was strictly how much time it would take to download 1 million images.

If we were to upload the images to S3 directly as we are downloading, we'd be limited by the S3 write quota of **3 500 POST** requests per second.  
Still fast but not as fast as downloading and writing to ephemeral storage of the function.

-----------------------------------------------------------

## Usage

### Prerequisites
- AWS Account activated
- [AWS CLI + configuration](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- Node.js
- [Serverless framework](https://www.serverless.com/framework/docs/getting-started)

### Deployment

In order to deploy the example, you need to run the following command:

```
$ serverless deploy
```

After running deploy, you should see output similar to:

```bash
Deploying aws-node-project to stage dev (us-east-1)

✔ Service deployed to stack aws-node-project-dev (112s)

functions:
  hello: aws-node-project-dev-hello (1.5 kB)
```

### Invocation

After successful deployment, you can invoke the deployed function by using the following command:

```bash
serverless invoke --function hello
```

Which should result in response similar to the following:

```json
{
    "statusCode": 200,
    "body": "{\n  \"message\": \"Go Serverless v3.0! Your function executed successfully!\",\n  \"input\": {}\n}"
}
```

### Local development

You can invoke your function locally by using the following command:

```bash
serverless invoke local --function hello
```

Which should result in response similar to the following:

```
{
    "statusCode": 200,
    "body": "{\n  \"message\": \"Go Serverless v3.0! Your function executed successfully!\",\n  \"input\": \"\"\n}"
}
```

## Production use cases
Deploy as a microservice that will handle all downloads related to your project.
