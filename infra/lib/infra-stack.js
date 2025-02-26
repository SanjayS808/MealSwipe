const cdk = require('aws-cdk-lib');
const ec2 = require('aws-cdk-lib/aws-ec2');
const ecs = require('aws-cdk-lib/aws-ecs');
const ecsPatterns = require('aws-cdk-lib/aws-ecs-patterns');
const ecr = require('aws-cdk-lib/aws-ecr');

class MyAppStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Create a new VPC with default settings (2 AZs for high availability)
    const vpc = new ec2.Vpc(this, 'MealSwipeVPC', {
      maxAzs: 2,
    });

    // Create an ECS cluster within the VPC
    const cluster = new ecs.Cluster(this, 'MealSwipeCluster', { vpc });

    // Add EC2 capacity to the cluster (e.g., t3.nano instances)
    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t3.nano'),
      desiredCapacity: 2,
    });

    // Create ECR repositories for backend and frontend images
    const backendRepo = new ecr.Repository(this, 'BackendRepo');
    const frontendRepo = new ecr.Repository(this, 'FrontendRepo');

    // Define an ECS service with an Application Load Balancer
    const ecsService = new ecsPatterns.ApplicationLoadBalancedEc2Service(this, 'MealSwipeAppService', {
      cluster,
      memoryLimitMiB: 512,
      taskImageOptions: {
        // Replace with your ECR backend image URI
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        containerPort: 3000,
      },
      publicLoadBalancer: true,
    });

    // Grant the ECS task role permissions to pull images from the ECR repositories
    backendRepo.grantPull(ecsService.taskDefinition.taskRole);
    frontendRepo.grantPull(ecsService.taskDefinition.taskRole);
  }
}

module.exports = { MyAppStack };
