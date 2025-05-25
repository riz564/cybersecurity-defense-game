# Use a lightweight base image with Nginx
FROM nginx:alpine

# Remove default Nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy your local static files (HTML, CSS, JS) into the container
COPY . /usr/share/nginx/html

# Set proper permissions for the files
RUN chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80
