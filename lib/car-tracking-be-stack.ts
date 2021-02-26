import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export class CarTrackingBeStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, 'itineraries', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    });

    const createIndexLambda = new lambda.Function(this, 'createIndexLambdaHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: new lambda.AssetCode('src'),
      handler: 'basic.handler',
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    const listItemLambda = new lambda.Function(this, 'getItemHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: new lambda.AssetCode('src'),
      handler: 'basic.listItemHandler',
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    table.grantReadWriteData(createIndexLambda);
    table.grantReadData(listItemLambda);

    // create the API Gateway with one method and path
    const api = new apigw.RestApi(this, 'hello-api');

    api.root
        .resourceForPath('/itineraries')
        .addMethod('GET', new apigw.LambdaIntegration(listItemLambda));

    api.root
        .resourceForPath('/itineraries')
        .addMethod('POST', new apigw.LambdaIntegration(createIndexLambda));

    new cdk.CfnOutput(this, 'HTTP API URL', {
      value: api.url ?? 'Something went wrong with the deploy',
    });
  }
}
