// module.exports = {
//   apps: [
//     {
//       name: 'gunno-app',
//       script: 'npm run serve',
//       watch: true,
//       args: ['-s', 'dist', '-l', '5174'],
//     },
//   ],
// }

module.exports = {
  apps: [
    {
      name: 'gunno-app',
      script: './dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      wait_ready: true,
      listen_timeout: 5000,
      env: {
        NODE_ENV: 'production',
      },
      pre_start: 'npm install && npm run build',
    },
  ],
  deploy: {
    production: {
      user: 'root',
      host: '177.153.50.232',
      ref: 'origin/main',
      repo: 'git@github.com:marcosvictorsb/gunno-app.git',
      path: '/var/www/frontend/gunno-app',
      'post-deploy':
        'npm install && pm2 reload ecosystem.config.js --env production',
    },
  },
}
