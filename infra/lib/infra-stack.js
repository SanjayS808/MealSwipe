const cdk = require('aws-cdk-lib');
const ec2 = require('aws-cdk-lib/aws-ec2');
const ecs = require('aws-cdk-lib/aws-ecs');
const ecsPatterns = require('aws-cdk-lib/aws-ecs-patterns');
const ecr = require('aws-cdk-lib/aws-ecr');
const s3 = require('aws-cdk-lib/aws-s3');
const cloudfront = require('aws-cdk-lib/aws-cloudfront');
const origins = require('aws-cdk-lib/aws-cloudfront-origins');
const logs = require('aws-cdk-lib/aws-logs');
const iam = require('aws-cdk-lib/aws-iam');

class MealSwipeAppService extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Create a new VPC with default settings (2 AZs for high availability)
    const vpc = new ec2.Vpc(this, 'MealSwipeVPC', {
      maxAzs: 2,
    });

    // Create an ECS cluster within the VPC
    const cluster = new ecs.Cluster(this, 'MealSwipeCluster', { vpc });

    // Add EC2 capacity to the cluster
    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t3.small'),
      desiredCapacity: 2,
      minCapacity: 1,
      maxCapacity: 4
    });

    // Reference existing ECR repository for backend instead of creating it
    const backendRepo = ecr.Repository.fromRepositoryName(
      this, 
      'BackendRepo', 
      'mealswipe/backend-repo'
    );

    // Backend service with load balancer
    const backendService = new ecsPatterns.ApplicationLoadBalancedEc2Service(this, 'BackendService', {
      cluster,
      memoryLimitMiB: 1024,
      cpu: 512,
      taskImageOptions: {
        image: ecs.ContainerImage.fromEcrRepository(backendRepo, 'latest'),
        containerPort: 5000,
        environment: {
          NODE_ENV: 'production'
        },
        // Adding healthcheck to ensure connection to ECR container works.dd
        healthCheck: {
          command: ["CMD-SHELL", "curl -X GET -f http://localhost:5000/health || exit 1"],
          interval: cdk.Duration.seconds(30),
          retries: 3,
          timeout: cdk.Duration.minutes(3)
        },
        // Adding logging for debugging
        enableLogging: true,
        logDriver: ecs.LogDrivers.awsLogs({
          streamPrefix: 'backend-service',
          logRetention: logs.RetentionDays.ONE_WEEK
        })
      },
    });

    // For your backend service
    backendService.node.addDependency(
      new cdk.CfnOutput(this, 'BackendServiceRetentionPolicy', {
        value: 'RETAIN',
        exportName: 'BackendServiceRetention'
      })
    );

    // Grant the ECS task roles permissions to pull images
    backendRepo.grantPull(backendService.taskDefinition.taskRole);

    // Add scaling policies for the backend service
    const scalableTarget = backendService.service.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: 10,
    });

    scalableTarget.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 80,
    });

    scalableTarget.scaleOnMemoryUtilization('MemoryScaling', {
      targetUtilizationPercent: 80,
    });

    // =========== FRONTEND S3 + CLOUDFRONT SETUP ===========

    // Import the existing bucket:
    const frontendBucket = s3.Bucket.fromBucketName(
      this, 
      'FrontendBucket', 
      'mealswipe-frontend'
    );

    // CloudFront origin access identity to access the S3 bucket
    const cloudFrontOAI = new cloudfront.OriginAccessIdentity(this, 'CloudFrontOAI');
    

    // Create the bucket policy using the low-level CloudFormation construct
    new s3.CfnBucketPolicy(this, 'BucketPolicy', {
      bucket: frontendBucket.bucketName,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 's3:GetObject',
            Effect: 'Allow',
            Principal: {
              CanonicalUser: cloudFrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId
            },
            Resource: `${frontendBucket.bucketArn}/*`
          }
        ]
      }
    });

    const updateBucketPolicyRole = new iam.Role(this, 'UpdateBucketPolicyRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
    });

    updateBucketPolicyRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
    );

    updateBucketPolicyRole.addToPolicy(new iam.PolicyStatement({
      actions: ['s3:GetBucketPolicy', 's3:PutBucketPolicy'],
      resources: [frontendBucket.bucketArn]
    }));

    // Check if CloudFront exists, otherwise create CloudFront distribution 
    const distributionId = this.node.tryGetContext('frontendDistributionID');
    
    let distribution;
    if (distributionId) {
      // Import existing distribution
      distribution = cloudfront.Distribution.fromDistributionAttributes(this, 'FrontendDistribution', {
        distributionId: distributionId,
        domainName: `${distributionId}.cloudfront.net`
      });
    } else {
        distribution = new cloudfront.Distribution(this, 'FrontendDistribution', {
        defaultBehavior: {
          origin: new origins.S3BucketOrigin(frontendBucket, {
            originAccessIdentity: cloudFrontOAI,
          }),
          defaultRootObject: 'index.html',
          // TODO: Allow and add HTTPS communication.
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.ALLOW_ALL,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        },
        errorResponses: [
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: '/index.html', // For SPA routing
          },
        ],
        priceClass: cloudfront.PriceClass.PRICE_CLASS_100, // Cheapest option
        enabled: true,
      });
    }

    // Add a behavior for API calls to be forwarded to the backend service
    distribution.addBehavior('/api/*', new origins.LoadBalancerV2Origin(backendService.loadBalancer, {
      protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
    }), {
      allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
      // TODO: Allow and add HTTPS communication.
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.ALLOW_ALL,
      cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
      originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER,
    });

    // Output important resources
    new cdk.CfnOutput(this, 'BackendURL', {
      value: `http://${backendService.loadBalancer.loadBalancerDnsName}`
    });

    new cdk.CfnOutput(this, 'FrontendURL', {
      value: `https://${distribution.distributionDomainName}`
    });

    new cdk.CfnOutput(this, 'S3BucketName', {
      value: frontendBucket.bucketName
    });

    new cdk.CfnOutput(this, 'CloudFrontDistributionId', {
      value: distribution.distributionId
    });
  }
}

module.exports = { MealSwipeAppService };