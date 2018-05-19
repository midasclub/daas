#!/usr/bin/env bash

cat > /usr/local/bin/run-daas << EOF
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

chmod +x /usr/local/bin/run-daas
