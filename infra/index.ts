import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as synced_folder from '@pulumi/synced-folder';

// Import the program's configuration settings.
const config = new pulumi.Config();
const path = config.get('artifactPath') || '../public';
const indexDocument = config.get('indexDocument') || 'index.html';
const errorDocument = config.get('errorDocument') || 'index.html';

const env = pulumi.getStack();
const projectName = pulumi.getProject();

// Create an S3 bucket and configure it as a website.
const bucketName = `${projectName}-s3-bucket-${env}`;
const bucket = new aws.s3.Bucket(bucketName, {
  website: {
    indexDocument: indexDocument,
    errorDocument: errorDocument,
  },
  tags: {
    'vfd:project': pulumi.getProject(),
    'vfd:stack': pulumi.getStack(),
  },
});

const originAccessIdentity = new aws.cloudfront.OriginAccessIdentity(
  `${projectName}-oai`,
  {
    comment: `Origin access identity for ${projectName}`,
  }
);

// Create a CloudFront CDN to distribute and cache the website.
const cdnName = `${projectName}-cdn-${env}`;
const cdn = new aws.cloudfront.Distribution(
  cdnName,
  {
    enabled: true,
    httpVersion: 'http2',
    isIpv6Enabled: true,
    waitForDeployment: true,
    retainOnDelete: false,
    origins: [
      {
        originId: bucket.arn,
        domainName: bucket.bucketRegionalDomainName,
        s3OriginConfig: {
          originAccessIdentity: originAccessIdentity.cloudfrontAccessIdentityPath,
        },
      },
    ],
    defaultCacheBehavior: {
      targetOriginId: bucket.arn,
      viewerProtocolPolicy: 'redirect-to-https',
      allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
      cachedMethods: ['GET', 'HEAD', 'OPTIONS'],
      defaultTtl: 600,
      maxTtl: 600,
      minTtl: 600,
      forwardedValues: {
        queryString: true,
        cookies: {
          forward: 'all',
        },
      },
    },
    orderedCacheBehaviors: [
      {
        pathPattern: 'index.html',
        allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
        cachedMethods: ['GET', 'HEAD', 'OPTIONS'],
        targetOriginId: bucket.arn,
        forwardedValues: {
          queryString: true,
          cookies: {
            forward: 'all',
          },
        },
        defaultTtl: 10,
        minTtl: 0,
        maxTtl: 20,
        compress: true,
        viewerProtocolPolicy: 'redirect-to-https',
      },
    ],
    priceClass: 'PriceClass_All',
    customErrorResponses: [
      {
        errorCode: 404,
        responseCode: 404,
        responsePagePath: `/${errorDocument}`,
      },
      {
        errorCode: 403,
        responseCode: 403,
        responsePagePath: `/${errorDocument}`,
      },
    ],
    restrictions: {
      geoRestriction: {
        restrictionType: 'none',
      },
    },
    viewerCertificate: {
      cloudfrontDefaultCertificate: true,
    },
    tags: {
      'vfd:project': pulumi.getProject(),
      'vfd:stack': pulumi.getStack(),
    },
  },
  { protect: true }
);

// Bucket policy for S3
const bucketPolicyForCloudfront = aws.iam.getPolicyDocumentOutput({
  version: '2008-10-17',
  policyId: 'PolicyForCloudFrontPrivateContent',
  statements: [
    {
      sid: 'AllowCloudFrontServicePrincipal',
      effect: 'Allow',
      principals: [
        {
          type: 'Service',
          identifiers: ['cloudfront.amazonaws.com'],
        },
      ],
      actions: ['s3:GetObject'],
      resources: [pulumi.interpolate`${bucket.arn}/*`],
      conditions: [
        {
          test: 'StringEquals',
          variable: 'AWS:SourceArn',
          values: [cdn.arn],
        },
      ],
    },
    {
      sid: 'AllowLegacyOAIReadOnly',
      effect: 'Allow',
      principals: [
        {
          type: 'AWS',
          identifiers: [originAccessIdentity.iamArn],
        },
      ],
      actions: ['s3:GetObject'],
      resources: [pulumi.interpolate`${bucket.arn}/*`],
    },
  ],
});

new aws.s3.BucketPolicy('bucketPolicyName', {
  bucket: bucket.arn,
  policy: bucketPolicyForCloudfront.apply(policy => policy.json),
});

// Use a synced folder to manage the files of the website.
new synced_folder.S3BucketFolder(`${projectName}-s3-bucket-folder-${env}`, {
  path: path,
  bucketName: bucket.bucket,
  acl: 'public-read',
  managedObjects: false,
});

// Export the URLs and hostnames of the bucket and distribution.
export const originURL = pulumi.interpolate`http://${bucket.websiteEndpoint}`;
export const originHostname = bucket.websiteEndpoint;
export const cdnURL = pulumi.interpolate`https://${cdn.domainName}`;
export const cdnHostname = cdn.domainName;
