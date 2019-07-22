# Deploying  

## Requirements:  
1. [NodeJS >= 10.x](https://nodejs.org)  
2. [Serverless](https://serverless.com)  

## Developing:
1. Run `npm install` to install dependencies  
2. Create a `env.yml` file in the root  
3. In your `env.yml` file,  
```bash
secrets:
  APP_ID: <github-appid>
  WEBHOOK_SECRET: <webhhok-secret>
  PRIVATE_KEY_PATH: "/opt/<private-key-name>.pem"
  CERT_ARN: "<aws-certificate-arn>"
  VPC_ID: "<default-or-custom-vpc-id>"
  SUBNET_1: "<subnet-1-id>"
  SUBNET_2: "<subnet-2-id>"
```  
4. Deploy using `sls deploy -v`  

If you would like to run your own instance of this app, see the [docs for deployment](https://probot.github.io/docs/serverless-deployment/).  

This app requires these **Permissions & events** for the GitHub App:

- Issues - **Read & Write**
  - [x] Check the box for **Issue comment** events
  - [x] Check the box for **Issues** events
- Single File - **Read-only**
  - Path: `.github/labeler.yml`
