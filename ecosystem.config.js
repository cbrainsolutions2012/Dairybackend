module.exports = {
  apps: [
    {
      name: "milk-dairy-api",
      script: "server.js",
      instances: "max", // Use all CPU cores
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      // Logging
      log_file: "./logs/app.log",
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",

      // Auto restart
      watch: false,
      ignore_watch: ["node_modules", "logs"],

      // Memory and CPU limits
      max_memory_restart: "500M",

      // Restart policy
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",

      // Health monitoring
      health_check_http_url: "http://localhost:3000/",
      health_check_max_requests: 5,
      health_check_max_fails: 3,
    },
  ],
};
