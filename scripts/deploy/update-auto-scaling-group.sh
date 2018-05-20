#!/bin/bash

set -e -x

launch_config_name=$(cat "${LC_INPUT_DIR}/launch_configuration_name")

aws autoscaling update-auto-scaling-group \
    --auto-scaling-group-name="${AUTO_SCALING_GROUP_NAME}" \
    --launch-configuration-name="${launch_config_name}"