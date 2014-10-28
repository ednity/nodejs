# config valid only for Capistrano 3.1
lock '3.2.1'

require 'capistrano/slack'

set :application, 'Ednity-nodejs'
set :repo_url, 'git@github.com:ednity/nodejs.git'

# Default branch is :master
# ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }.call
set :branch, "master"

# Default deploy_to directory is /var/www/my_app
set :deploy_to, '/home/ec2-user/nodejs'

set :ssh_options, {
    keys: %w(~/.ssh/ednity-aws.pem),
    forward_agent: true,
    auth_methods: %w(publickey)
  }


# Default value for :scm is :git
# set :scm, :git

set :format, :pretty
set :log_level, :debug
set :pty, true

# Default value for :linked_files is []
# set :linked_files, %w{config/database.yml}

# Default value for linked_dirs is []
set :linked_dirs, %w{node_modules log tmp/pids}

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
set :keep_releases, 5

namespace :deploy do
  after :publishing, :restart

  desc "Stop Forever"
  task :stop do
    on roles(:app) do
      execute "forever stop #{current_path}/timeline.js"
    end
  end

  desc "Start Forever"
  task :start do
    on roles(:app) do
      # forever is running by upstart
    end
  end

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      execute "forever restart #{current_path}/timeline.js"
    end
  end

  desc "npm install"
  task :npm_install do
    on roles(:app) do
      execute "npm install"
    end
  end

  before :restart, :npm_install

end


set :slack_token, "5jJ4ES3q0SKyWfkTZvokttQ2"
set :slack_room, "#develop"
set :slack_subdomain, "ednity"


before 'deploy', 'slack:starting'
after 'deploy',  'slack:finished'

