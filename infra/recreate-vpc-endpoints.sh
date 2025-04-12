#!/bin/bash
# recreate-vpc-endpoints.sh
# Recreates VPC endpoints from a backup file in us-west-1 region
# Looks for backup files in the "backups" directory

set -e

# Set the region
REGION="us-west-1"

# Set backups directory
BACKUPS_DIR="backups"

# Check if backups directory exists
if [ ! -d "$BACKUPS_DIR" ]; then
    echo "Warning: Backups directory '$BACKUPS_DIR' does not exist"
    echo "Creating directory '$BACKUPS_DIR'"
    mkdir -p "$BACKUPS_DIR"
fi

# Check if backup file is provided
if [ $# -ne 1 ]; then
    # Look for the most recent backup file in the backups directory
    if [ -d "$BACKUPS_DIR" ]; then
        cd "$BACKUPS_DIR"
        BACKUP_FILES=(vpc-endpoints-backup-*.json)
        cd ..
        
        if [ ${#BACKUP_FILES[@]} -eq 0 ] || [ ! -f "$BACKUPS_DIR/${BACKUP_FILES[0]}" ]; then
            echo "Error: No backup files found in $BACKUPS_DIR directory"
            echo "Usage: $0 <backup-file>"
            exit 1
        fi
        
        # Sort files by modification time, newest first
        NEWEST_BACKUP=$(ls -t "$BACKUPS_DIR"/vpc-endpoints-backup-*.json 2>/dev/null | head -n1)
        
        if [ -z "$NEWEST_BACKUP" ]; then
            echo "Error: No backup files found in $BACKUPS_DIR directory"
            exit 1
        fi
        
        BACKUP_FILE="$NEWEST_BACKUP"
        echo "Using most recent backup file: $BACKUP_FILE"
    else
        echo "Error: Backups directory '$BACKUPS_DIR' does not exist"
        exit 1
    fi
else
    # Check if provided path is absolute or relative
    if [[ "$1" == /* ]] || [[ "$1" == ./* ]]; then
        # Use the path as is
        BACKUP_FILE="$1"
    else
        # Assume the file is in the backups directory
        BACKUP_FILE="$BACKUPS_DIR/$1"
    fi
    
    if [ ! -f "$BACKUP_FILE" ]; then
        echo "Error: Backup file $BACKUP_FILE not found"
        exit 1
    fi
fi

echo "Recreating VPC endpoints from backup file: $BACKUP_FILE"

# Count endpoints in backup
ENDPOINT_COUNT=$(jq '.VpcEndpoints | length' "$BACKUP_FILE")
echo "Found $ENDPOINT_COUNT endpoint(s) in backup file"

# Process each endpoint
jq -c '.VpcEndpoints[]' "$BACKUP_FILE" | while read -r endpoint; do
    # Extract required fields for recreation
    VPC_ID=$(echo "$endpoint" | jq -r '.VpcId')
    SERVICE_NAME=$(echo "$endpoint" | jq -r '.ServiceName')
    ENDPOINT_TYPE=$(echo "$endpoint" | jq -r '.VpcEndpointType')
    ENDPOINT_ID=$(echo "$endpoint" | jq -r '.VpcEndpointId')
    
    echo "Recreating $ENDPOINT_TYPE endpoint for service: $SERVICE_NAME (was $ENDPOINT_ID)"
    
    # Base command for all endpoint types
    CREATE_CMD="aws ec2 create-vpc-endpoint \
        --region $REGION \
        --vpc-id $VPC_ID \
        --service-name $SERVICE_NAME \
        --vpc-endpoint-type $ENDPOINT_TYPE"
    
    # Handle Gateway endpoints
    if [ "$ENDPOINT_TYPE" = "Gateway" ]; then
        # Extract route table IDs
        ROUTE_TABLE_IDS=$(echo "$endpoint" | jq -r '.RouteTableIds[]' 2>/dev/null || echo "")
        
        # Add route tables if we have them
        if [ -n "$ROUTE_TABLE_IDS" ]; then
            RT_ARGS=""
            for RT_ID in $ROUTE_TABLE_IDS; do
                RT_ARGS="$RT_ARGS --route-table-ids $RT_ID"
            done
            CREATE_CMD="$CREATE_CMD $RT_ARGS"
        fi
    
    # Handle Interface endpoints    
    elif [ "$ENDPOINT_TYPE" = "Interface" ]; then
        # Extract subnet IDs
        SUBNET_IDS=$(echo "$endpoint" | jq -r '.SubnetIds[]' 2>/dev/null || echo "")
        
        # Extract security group IDs
        SECURITY_GROUP_IDS=$(echo "$endpoint" | jq -r '.Groups[].GroupId' 2>/dev/null || echo "")
        
        # Add subnet IDs if we have them
        if [ -n "$SUBNET_IDS" ]; then
            SUBNET_ARGS=""
            for S_ID in $SUBNET_IDS; do
                SUBNET_ARGS="$SUBNET_ARGS --subnet-ids $S_ID"
            done
            CREATE_CMD="$CREATE_CMD $SUBNET_ARGS"
        fi
        
        # Add security group IDs if we have them
        if [ -n "$SECURITY_GROUP_IDS" ]; then
            SG_ARGS=""
            for SG_ID in $SECURITY_GROUP_IDS; do
                SG_ARGS="$SG_ARGS --security-group-ids $SG_ID"
            done
            CREATE_CMD="$CREATE_CMD $SG_ARGS"
        fi
        
        # Add private DNS setting
        PRIVATE_DNS=$(echo "$endpoint" | jq -r '.PrivateDnsEnabled')
        if [ "$PRIVATE_DNS" = "true" ]; then
            CREATE_CMD="$CREATE_CMD --private-dns-enabled"
        else
            CREATE_CMD="$CREATE_CMD --no-private-dns-enabled"
        fi
    
    # Handle GatewayLoadBalancer endpoints
    elif [ "$ENDPOINT_TYPE" = "GatewayLoadBalancer" ]; then
        # Extract subnet IDs
        SUBNET_IDS=$(echo "$endpoint" | jq -r '.SubnetIds[]' 2>/dev/null || echo "")
        
        # Add subnet IDs if we have them
        if [ -n "$SUBNET_IDS" ]; then
            SUBNET_ARGS=""
            for S_ID in $SUBNET_IDS; do
                SUBNET_ARGS="$SUBNET_ARGS --subnet-ids $S_ID"
            done
            CREATE_CMD="$CREATE_CMD $SUBNET_ARGS"
        fi
    fi
    
    # Add policy if exists (applies to all types)
    POLICY=$(echo "$endpoint" | jq -r '.PolicyDocument // empty')
    if [ -n "$POLICY" ] && [ "$POLICY" != "null" ]; then
        POLICY_FILE="temp_policy_$(date +%s).json"
        echo "$POLICY" > "$POLICY_FILE"
        CREATE_CMD="$CREATE_CMD --policy-document file://$POLICY_FILE"
    fi
    
    # Execute the command
    echo "Executing: $CREATE_CMD"
    eval "$CREATE_CMD"
    
    echo "Created endpoint for service: $SERVICE_NAME"
    
    # Clean up temporary policy file if created
    if [ -n "$POLICY" ] && [ "$POLICY" != "null" ] && [ -f "$POLICY_FILE" ]; then
        rm -f "$POLICY_FILE"
    fi
done

echo "All VPC endpoints have been recreated from backup"
