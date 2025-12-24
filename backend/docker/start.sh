#!/bin/bash
set -e

cd /var/www/html

php artisan migrate --force
php artisan db:seed --force || true
# give chmod 777 to database.sqlite
chmod 777 database/database.sqlite
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
