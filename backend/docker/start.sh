#!/bin/bash
set -e

cd /var/www/html

php artisan migrate --force
php artisan db:seed --force || true

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
