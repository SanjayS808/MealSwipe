#!/bin/bash
# delete-all-vpc-endpoints.sh
# Deletes all VPC endpoints in the us-west-1 region and saves backup to the backups directory

set -e

# Set the region
REGION="us-west-1"

# Set backups directory
BACKUPS_DIR="backups"

# Create backups directory if it doesn't exist
if [ ! -d "$BACKUPS_DIR" ]; then
    echo "Creating backups directory: $BACKUPS_DIR"
    mkdir -p "$BACKUPS_DIR"
fi

echo "Finding and deleting all VPC endpoints in region: $REGION"

# Get all endpoints in the region
echo "Querying for endpoints..."
ENDPOINTS_JSON=$(aws ec2 describe-vpc-endpoints \
    --region $REGION \
    --output json)

# Check if we have any endpoints
ENDPOINT_COUNT=$(echo "$ENDPOINTS_JSON" | jq '.VpcEndpoints | length')
echo "Found $ENDPOINT_COUNT VPC endpoint(s)"

if [ "$ENDPOINT_COUNT" -eq 0 ]; then
    echo "No VPC endpoints found in region $REGION"
    exit 0
fi

# Save endpoint configuration for recreation in the backups directory
BACKUP_FILENAME="vpc-endpoints-backup-$(date +%Y%m%d-%H%M%S).json"
BACKUP_FILE="$BACKUPS_DIR/$BACKUP_FILENAME"
echo "Saving endpoint configurations to $BACKUP_FILE"
echo "$ENDPOINTS_JSON" > "$BACKUP_FILE"

# Display endpoints that will be deleted
echo "Endpoints to be deleted:"
echo "$ENDPOINTS_JSON" | jq -r '.VpcEndpoints[] | "ID: \(.VpcEndpointId), Type: \(.VpcEndpointType), Service: \(.ServiceName), VPC: \(.VpcId)"'

# Confirm deletion
read -p "Are you sure you want to delete all $ENDPOINT_COUNT endpoint(s)? (y/n): " confirm
if [[ "$confirm" != [yY] && "$confirm" != [yY][eE][sS] ]]; then
    echo "Deletion cancelled"
    exit 0
fi

# Get all endpoint IDs
ENDPOINT_IDS=$(echo "$ENDPOINTS_JSON" | jq -r '.VpcEndpoints[].VpcEndpointId')

# Delete each endpoint
for ENDPOINT_ID in $ENDPOINT_IDS; do
    echo "Deleting endpoint: $ENDPOINT_ID"
    aws ec2 delete-vpc-endpoints \
        --region $REGION \
        --vpc-endpoint-ids "$ENDPOINT_ID"
    echo "Deleted endpoint: $ENDPOINT_ID"
done

echo "All VPC endpoints in region $REGION have been deleted"
echo "Endpoint configurations saved to $BACKUP_FILE"
echo "To recreate the endpoints, run: ./recreate-vpc-endpoints.sh $BACKUP_FILENAME"
