DIR=$(dirname $0)
DATA=$(realpath "$DIR/../data")

curl -i -X POST \
    -H "Content-Type: application/json" \
    -H "aeg-event-type: Notification" \
    "localhost:7071/runtime/webhooks/eventgrid?functionName=CertificateUpdatedHandler" \
    -d "@$DATA/CertificateUpdatedEvent.json"
