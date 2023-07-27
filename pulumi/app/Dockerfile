FROM amazon/aws-lambda-nodejs:18
ARG FUNCTION_DIR="/var/task"

WORKDIR /var/task

COPY package*.json .

RUN npm install

RUN npm install -g typescript

COPY . .

RUN npm run build

RUN mkdir -p ${FUNCTION_DIR}
RUN cp -r dist/* ${FUNCTION_DIR}

CMD [ "dist/index.handler" ]
