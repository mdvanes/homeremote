#!/bin/bash

curl 'http://localhost:3000/login' \
    -H 'Pragma: no-cache' \
    -H 'Origin: http://localhost:8080' \
    -H 'Accept-Encoding: gzip, deflate, br' \
    -H 'Accept-Language: en-US,en;q=0.8,nl;q=0.6' \
    -H 'Upgrade-Insecure-Requests: 1' \
    -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' \
    -H 'Cache-Control: no-cache' \
    -H 'Referer: http://localhost:8080/login' \
    -H 'Cookie: Webstorm-23b18f79=02da8610-bd92-4e0d-aa43-4eb26fb6c2cc; _ga=GA1.1.1184280038.1509267704; connect.sid=s%3AHcgZbTPfQdsHGkXlJegZ7YWCVNXan6D5.YuY2OGIrEhtm%2BBYjCXghdSLFibGshuzttxMOa94I%2BvE' \
    -H 'Connection: keep-alive' \
    --data 'username=john&password=test' \
    --compressed

# TODO This endpoint sends no response on connect. Better to leave the "echo" endpoint in so that can be tested easily?
curl 'http://localhost:3000/fm/mvToTargetLocationProgress' \
    --include \
    --no-buffer \
    -H 'Pragma: no-cache' \
    -H "Host: localhost:8080" \
    -H 'Origin: http://localhost:8080' \
    -H 'Accept-Encoding: gzip, deflate, sdch, br' \
    -H 'Sec-WebSocket-Version: 13' \
    -H 'Accept-Language: en-US,en;q=0.8,nl;q=0.6' \
    -H 'Sec-WebSocket-Key: IFo5dHgjEE43+/K0hq5gZA==' \
    -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36' \
    -H 'Upgrade: websocket' \
    -H 'Cache-Control: no-cache' \
    -H 'Cookie: Webstorm-23b18f79=02da8610-bd92-4e0d-aa43-4eb26fb6c2cc; _ga=GA1.1.1184280038.1509267704; connect.sid=s%3AHcgZbTPfQdsHGkXlJegZ7YWCVNXan6D5.YuY2OGIrEhtm%2BBYjCXghdSLFibGshuzttxMOa94I%2BvE' \
    -H 'Connection: Upgrade' \
    -H 'Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits' \
    --compressed

curl 'http://localhost:3000/hack' \
    --include \
    --no-buffer \
    -H 'Pragma: no-cache' \
    -H "Host: localhost:8080" \
    -H 'Origin: http://localhost:8080' \
    -H 'Accept-Encoding: gzip, deflate, sdch, br' \
    -H 'Sec-WebSocket-Version: 13' \
    -H 'Accept-Language: en-US,en;q=0.8,nl;q=0.6' \
    -H 'Sec-WebSocket-Key: IFo5dHgjEE43+/K0hq5gZA==' \
    -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36' \
    -H 'Upgrade: websocket' \
    -H 'Cache-Control: no-cache' \
    -H 'Cookie: Webstorm-23b18f79=02da8610-bd92-4e0d-aa43-4eb26fb6c2cc; _ga=GA1.1.1184280038.1509267704; connect.sid=s%3AHcgZbTPfQdsHGkXlJegZ7YWCVNXan6D5.YuY2OGIrEhtm%2BBYjCXghdSLFibGshuzttxMOa94I%2BvE' \
    -H 'Connection: Upgrade' \
    -H 'Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits' \
    --compressed

# Start the ws server on localhost:9001 and run this file; it should access the ws
# curl --include \
#      --no-buffer \
#      --header "Connection: Upgrade" \
#      --header "Upgrade: websocket" \
#      --header "Host: localhost:3000" \
#      --header "Origin: http://localhost:3000" \
#      --header "Sec-WebSocket-Key: SGVsbG8sIHdvcmxkIQ==" \
#      --header "Sec-WebSocket-Version: 13" \
#      http://localhost:3000/fm/mvToTargetLocationProgress/