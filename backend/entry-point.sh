#!/bin/bash

set -e

php artisan migrate --force

composer dump-autoload

php artisan db:seed --force || true

php artisan serve --host=0.0.0.0 --port=80
