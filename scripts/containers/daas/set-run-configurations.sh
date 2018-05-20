#!/usr/bin/env bash

cat > /usr/local/bin/daas-server << EOF
#!/bin/bash
set -e

cd /app

# Check if the migrations have been ran; if not, run them
is_migrated=\$(
psql -tA \${DATABASE_URL} << EOF2
SELECT EXISTS (
	SELECT 1
	FROM   information_schema.tables
	WHERE  table_schema = 'public'
	AND    table_name = 'bots'
);
EOF2
)

if [[ \$is_migrated = "f" ]]; then
	yarn migrations:up
	echo "Successfully ran the migrations"
fi

yarn start
EOF

cat > /usr/local/bin/daas-worker << EOF
#!/bin/bash
set -e

cd /app
yarn worker
EOF

cat > /usr/local/bin/daas-core << EOF
#!/bin/bash
set -e

cd /app
yarn core \$@
EOF

chmod +x /usr/local/bin/daas-server
chmod +x /usr/local/bin/daas-worker
chmod +x /usr/local/bin/daas-core
