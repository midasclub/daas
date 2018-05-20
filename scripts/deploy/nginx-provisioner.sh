#!/usr/bin/env bash

set -e -x

sudo apt install nginx -y

sudo rm /etc/nginx/sites-enabled/default

sudo tee /etc/nginx/sites-enabled/default << EOF
server {
	listen 80;
	server_name $HOST_NAME;

	if (\$http_x_forwarded_proto != "https") {
		return 301 https://$HOST_NAME\$request_uri;
	}

	location / {
		proxy_pass http://localhost:3000;
	}
}
EOF

sudo systemctl restart nginx