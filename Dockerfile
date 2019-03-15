FROM ajgrande924/node-libc6-compat-pm2:10

# Create app directory
WORKDIR /usr/src/app

# Bundle APP files
COPY src src/
COPY package*.json ./
COPY pm2.json ./

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production

# Show current folder structure in logs
# RUN ls -al -R

# Expose ports
EXPOSE 50051 443

CMD ["pm2-runtime", "start", "pm2.json", "--env", "production"]