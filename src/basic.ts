import * as AWS from 'aws-sdk';
const dynamodb = new AWS.DynamoDB();
import { v4 as uuidv4 } from 'uuid';
import * as faker from 'faker';
import moment from 'moment';

exports.handler = async function (event: any) {
    const tableName = process.env.TABLE_NAME || '';
    await dynamodb.putItem({
        TableName: tableName,
        Item : {
            id: { 'S': uuidv4() },
            driverName: { 'S': faker.name.firstName() },
            driverNumber: { 'S': faker.vehicle.vin() },
            createdAt: { 'S': new Date().toISOString() },
            startPoint: {
                'M': {
                    'lat': {
                        'N': faker.address.latitude()
                    },
                    'lng': {
                        'N': faker.address.longitude()
                    }
                }
            },
            destinationPoint: {
                'M': {
                    'lat': {
                        'N': faker.address.latitude()
                    },
                    'lng': {
                        'N': faker.address.longitude()
                    }
                }
            },
        }
    }).promise();

    // return response back to upstream caller
    return sendRes(200, 'ok');
};

exports.listItemHandler = async function (event: any) {
    const tableName = process.env.TABLE_NAME || '';

    const params: any = {
        TableName: tableName,
        FilterExpression: '#createdAt BETWEEN :start AND :end',
        ExpressionAttributeNames: {
            '#createdAt': 'createdAt'
        },
        ExpressionAttributeValues: {
            ':start': {
                S: moment().startOf('day').toISOString(),
            },
            ':end': {
                S: moment().endOf('day').toISOString()
            }
        }
    };

    const data = await dynamodb.scan(params).promise();

    // return response back to upstream caller
    return sendRes(200, JSON.stringify(data));
};

const sendRes = (status: number, body: any) => {
    var response = {
        statusCode: status,
        headers: {
            'Content-Type': 'application/json',
        },
        body: body,
    };
    return response;
};