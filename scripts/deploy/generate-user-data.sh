#!/bin/bash

set -e -x

cat > "user-data/user-data" << EOF
#!/bin/bash

export AWS_AMI_ID=$(cat ami/id | sed 's/"//g')

sudo docker run \\
    -e DATABASE_URL="${DATABASE_URL}" \\
    -e AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID}" \\
    -e AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY}" \\
    -e AWS_REGION="${AWS_REGION}" \\
    -e AWS_AMI_ID="${AWS_AMI_ID}" \\
    -e DOCKER_REPO="${DOCKER_REPO}" \\
    -e LOG_TRANSMISSION_ADDRESS="${LOG_ADDRESS}" \\
    -e LOG_TRANSMISSION_PORT_CORE="${LOG_PORT_CORE}" \\
    -e PORT=3000 \\
    -p "3000:3000" \\
    "${DOCKER_REPO}" \\
    "${DOCKER_COMMAND}" | \\
    nc ${LOG_ADDRESS} ${LOG_PORT}
EOF
