#!/bin/bash
# run this from cron to perform update

NODE=$(which node)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $SCRIPT_DIR
$NODE $SCRIPT_DIR
surge site sultanwatch.surge.sh
