#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CarTrackingBeStack } from '../lib/car-tracking-be-stack';

const app = new cdk.App();
new CarTrackingBeStack(app, 'CarTrackingBeStack');
