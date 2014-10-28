set :stage, :staging

set :deploy_to, '/home/ec2-user/nodejs-staging'
role :app, "ec2-user@54.199.128.230"
