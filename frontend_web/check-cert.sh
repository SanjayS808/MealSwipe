#!/bin/bash

# SSL Certificate Diagnosis Script

CERT_PATH="./.cert"

# Function to check certificate details
check_certificate() {
    local cert_file=$1
    echo "Examining certificate: $cert_file"
    
    # Check if file exists
    if [ ! -f "$cert_file" ]; then
        echo "❌ Certificate file does not exist: $cert_file"
        return 1
    fi
    
    # Display certificate details
    echo "📜 Certificate Details:"
    openssl x509 -in "$cert_file" -text -noout | grep -E "Subject:|Issuer:|Not Before:|Not After :|Subject Alternative Name:"
    
    # Verify certificate
    echo -e "\n🔍 Certificate Verification:"
    openssl verify -CAfile "$CERT_PATH/rootCA.pem" "$cert_file"
}

# Validate server certificate
check_certificate "$CERT_PATH/server.crt"

# Check root CA
echo -e "\n🔒 Root CA Details:"
openssl x509 -in "$CERT_PATH/rootCA.pem" -text -noout | grep -E "Subject:|Issuer:|Not Before:|Not After :"
