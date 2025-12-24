FROM php:8.4-cli

WORKDIR /app

RUN apt-get update && apt-get install -y unzip git \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

COPY . .

COPY ./.env.example .env
RUN composer install --no-dev --optimize-autoloader

RUN php artisan key:generate && php artisan optimize

# COPY ./entry-point.sh /entry-point.sh
RUN chmod +x /app/entry-point.sh

EXPOSE 8000

CMD ["/app/entry-point.sh"]
