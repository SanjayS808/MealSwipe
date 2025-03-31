#! /bin/bash

######################################################################
#
# This script generates an SSL certficate for local development. To
# execute the script, run `bash create-dev-ssl-cert.sh`. Sudo is
# needed to save the certificate to your Mac KeyChain. After the cert
# is generated, you can use `HTTPS=true yarn start` to run the web 
# server.
#
# Author: Andi Wilson
# Created: 03/23/2020
#
######################################################################

#!/bin/bash

CWD=$(pwd)
LOCAL_CERT_PATH=$CWD/.cert

# Ensure precise DNS names
DNS_1='localhost'
DNS_2='dev.embed.promethean.tv'
DNS_3='dev.broadcast.promethean.tv'
CERT_NAME='localhost (PTV Dev SSL Cert)'
ORG_NAME='Promethean TV, Inc.'

# Ensure .cert directory exists
mkdir -p $LOCAL_CERT_PATH
cd $LOCAL_CERT_PATH

# Generate Root CA Key (if not exists)
if [[ ! -f "rootCA.key" ]]; then
    openssl genrsa -des3 -out rootCA.key 2048
fi

# Generate Root CA Certificate (if not exists)
if [[ ! -f "rootCA.pem" ]]; then
    openssl req -x509 -new -nodes \
        -key rootCA.key \
        -subj "/C=US/ST=CA/O=$ORG_NAME/CN=$CERT_NAME" \
        -sha256 \
        -days 1024 \
        -out rootCA.pem
fi

# Create a more comprehensive v3.ext file
cat > v3.ext <<- EOM
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth, clientAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = $DNS_1
DNS.2 = $DNS_2
DNS.3 = $DNS_3
IP.1 = 127.0.0.1
EOM

# Generate Server Key
openssl req -new -sha256 -nodes \
    -subj "/C=US/ST=CA/O=$ORG_NAME/CN=$DNS_1" \
    -out server.csr \
    -newkey rsa:2048 \
    -keyout server.key

# Generate Server Certificate
openssl x509 -req \
    -in server.csr \
    -CA rootCA.pem \
    -CAkey rootCA.key \
    -CAcreateserial \
    -out server.crt \
    -days 500 \
    -sha256 \
    -extfile v3.ext

# Optional: Add to Keychain
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain rootCA.pem