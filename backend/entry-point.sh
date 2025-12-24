#!/bin/bash

set -e

php artisan migrate --force

php artisan migrate:fresh


php artisan db:seed --force || true

php artisan serve --host=0.0.0.0 --port=8000
