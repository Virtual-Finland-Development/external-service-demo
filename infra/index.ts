import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as synced_folder from '@pulumi/synced-folder';

// Import the program's configuration settings.
const config = new pulumi.Config();
const path = config.get('path') || '../public';
const indexDocument = config.get('indexDocument') || 'index.html';
const errorDocument = config.get('errorDocument') || 'index.html';

const env = pulumi.getStack();
const projectName = pulumi.getProject();

// Create an S3 bucket and configure it as a website.
const bucketName = `${projectName}-s3-bucket-${env}`;
const bucket = new aws.s3.Bucket(bucketName, {
  acl: 'public-read',
  website: {
    indexDocument: indexDocument,
    errorDocument: errorDocument,
  },
  tags: {
    'vfd:project': pulumi.getProject(),
    'vfd:stack': pulumi.getStack(),
  },
});

// Use a synced folder to manage the files of the website.
new synced_folder.S3BucketFolder(`${projectName}-s3-bucket-folder-${env}`, {
  path: path,
  bucketName: bucket.bucket,
  acl: 'public-read',
  managedObjects: false,
});

// Create a CloudFront CDN to distribute and cache the website.
const cdnName = `${projectName}-cdn-${env}`;
const cdn = new aws.cloudfront.Distribution(cdnName, {
  enabled: true,
  origins: [
    {
      originId: bucket.arn,
      domainName: bucket.bucketRegionalDomainName,
      s3OriginConfig: {
        originAccessIdentity: new aws.cloudfront.OriginAccessIdentity(
          `${projectName}-oai`,
          {
            comment: `Origin access identity for ${projectName}`,
          }
        ).cloudfrontAccessIdentityPath,
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
});

// Export the URLs and hostnames of the bucket and distribution.
export const originURL = pulumi.interpolate`http://${bucket.websiteEndpoint}`;
export const originHostname = bucket.websiteEndpoint;
export const cdnURL = pulumi.interpolate`https://${cdn.domainName}`;
export const cdnHostname = cdn.domainName;