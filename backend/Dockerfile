# Use official PHP image with Composer and common extensions
FROM php:8.2-fpm

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libzip-dev \
    libonig-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring zip bcmath

# Install Composer (latest)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy only composer files first (for better caching)
COPY backend/composer.json backend/composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

# Copy the rest of the application code
COPY backend/ .

# Set permissions for Laravel storage and bootstrap
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port 8000
EXPOSE 8000

# Start Laravel with PHP's built-in server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
