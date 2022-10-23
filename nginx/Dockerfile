from nginx

arg mode

# run apt update -y
# run apt install -y certbot
# run apt install -y python3-certbot-nginx

workdir /etc/nginx

# run openssl req -newkey rsa:4096 -x509 -sha512 -days 365 -nodes -out cert.pem -keyout key.pem
run mkdir certs
run bash -c "if [[ "$mode" -eq "dev" ]] ; then openssl req -nodes -newkey rsa:4096 -x509 -sha512 -days 365 -keyout certs/key.pem -out certs/cert.pem -subj '/C=US/ST=Texas/L=Texas/O=Discord Clone/OU=Discord Clone/CN=DiscordClone.com'; fi"
run bash -c "if [[ "$mode" -eq "prod" ]] ; then echo 'INSTALL CERT USING CERTBOT'; fi"
copy ./nginx.conf .
