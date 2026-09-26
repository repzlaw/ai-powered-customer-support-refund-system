#!/bin/sh
set -eu

mkdir -p /var/www/html/storage/app-data
touch /var/www/html/storage/app-data/database.sqlite

if [ -z "${APP_KEY:-}" ]; then
    if [ ! -s /var/www/html/storage/app-data/app.key ]; then
        php -r 'echo "base64:".base64_encode(random_bytes(32));' > /var/www/html/storage/app-data/app.key
    fi
    APP_KEY="$(cat /var/www/html/storage/app-data/app.key)"
    export APP_KEY
fi

php artisan migrate --force --no-interaction
php artisan db:seed --force --no-interaction
exec php artisan serve --host=0.0.0.0 --port=8000 --no-interaction
