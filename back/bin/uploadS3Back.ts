#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { UploadS3BackStack } from '../lib/uploadS3BackStack';

const app = new cdk.App();
new UploadS3BackStack(app, 'UploadS3BackStack', {
  env: {
    account: '506820257931', // replace with your AWS account ID
    region: 'eu-central-1', // replace with your AWS region
  },
});