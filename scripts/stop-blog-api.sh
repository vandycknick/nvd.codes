# /usr/bin/env bash

SOCKET="/tmp/nvd-codes-blog-api.sock"
PID=$(ss -xlp | grep -i $SOCKET | awk '{ print $9 }' | awk -F',' '{print $2}' | awk -F '=' '{ print $2}')

if [ -n "$PID" ]; then

    echo "Terminating blog api with pid $PID.."
    # SIGTERM
    kill -15 $PID

    sleep 1

    STILL_ALIVE=$(ps -o pid= -p $PID)

    if [ "$?" -eq 0 ]; then
        echo "Not gracefully terminated, killing $STILL_ALIVE"
        # SIGKILL
        kill -9 $PID
    fi

    rm -f $SOCKET
else
    echo "Blog api not running."
fi

echo "Finished"
