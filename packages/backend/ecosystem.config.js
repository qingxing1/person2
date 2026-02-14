module.exports = {
  apps: [{
    name: 'nest-admin2',
    script: 'dist/main.js',
    cwd: '/var/www/nest-admin2/servers',
    env: {
      NODE_ENV: 'production'
    },
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '1G',
    log_file: '/var/www/nest-admin2/logs/pm2-combined.log',
    out_file: '/var/www/nest-admin2/logs/pm2-out.log',
    error_file: '/var/www/nest-admin2/logs/pm2-error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true,
    autorestart: true,
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
}