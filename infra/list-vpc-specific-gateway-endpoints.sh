#!/bin/bash
# list-all-vpc-endpoints.sh
# Lists all VPC endpoints of any type in us-west-1 region

# Set the region
REGION="us-west-1"

echo "Listing ALL VPC endpoints in region: $REGION"
echo "----------------------------------------------------"

# Run the describe-vpc-endpoints command without filtering by type
echo "Running AWS CLI command to fetch endpoints..."
aws ec2 describe-vpc-endpoints \
    --region $REGION \
    --query "VpcEndpoints[*].{ID:VpcEndpointId,Type:VpcEndpointType,Service:ServiceName,VPC:VpcId,State:State}" \
    --output table

# Count by type
echo "----------------------------------------------------"
echo "Endpoint count by type:"
aws ec2 describe-vpc-endpoints \
    --region $REGION \
    --query "VpcEndpoints[].VpcEndpointType" \
    --output text | sort | uniq -c

echo "----------------------------------------------------"
echo "For detailed information on a specific endpoint, run:"
echo "aws ec2 describe-vpc-endpoints --region $REGION --vpc-endpoint-ids vpce-xxxx --output json"
