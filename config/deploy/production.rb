set :stage, :production

set :deploy_to, '/home/ec2-user/nodejs-production'
role :app, "ec2-user@54.199.128.230"
