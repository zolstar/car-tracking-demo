import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as CarTrackingBe from '../lib/car-tracking-be-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new CarTrackingBe.CarTrackingBeStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
