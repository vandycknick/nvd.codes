# /usr/bin/env bash

SOCKET="/tmp/nvd-codes-blog-api.sock"
PID=$(ss -xlp | grep -i $SOCKET | awk '{ print $9 }' | awk -F',' '{print $2}' | awk -F '=' '{ print $2}')

if [ -z "$PID" ]; then
    echo "Starting blog api"
    LOG_FILE=/tmp/nvd-codes-blog-api-output.log

    rm -f $LOG_FILE

    yarn workspace @nvd.codes/blog dev &> $LOG_FILE &
else
    echo "Already running $PID"
fi

echo "Finished"
