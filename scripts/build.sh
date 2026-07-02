#!/usr/bin/env bash

export PATH="$PATH:/home/deployuser/.nvm/versions/node/v22.13.1/bin"
cd ${REMOTE_PATH} && git pull &&npm ci && npm run build && pm2 restart 0

# GREEN='\033[0;32m'
# RED='\033[0;31m'
# NC='\033[0m'

# log() {
#     echo -e "${GREEN}$1${NC}"
# }

# error() {
#     echo -e "${RED}$1${NC}"
# }

# deploy() {

#     echo "Deploying the latest changes to production ${REMOTE_PATH}"
#     cd $REMOTE_PATH

#     git pull

#     echo "Building the project"

#     npm ci
#     npm run build
#     echo "Project built successfully"
    
#     echo "Deploying to production"
#     pm2 restart 0

# }

# deploy