from nginx

workdir /etc/nginx

# run openssl req -newkey rsa:4096 -x509 -sha512 -days 365 -nodes -out cert.pem -keyout key.pem
run mkdir certs
run openssl req -nodes -newkey rsa:4096 -x509 -sha512 -days 365 -keyout certs/key.pem -out certs/cert.pem -subj "/C=US/ST=Texas/L=Texas/O=Discord Clone/OU=Discord Clone/CN=Discord Clone"
copy ./nginx.conf .
