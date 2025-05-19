module.exports = {
  apps: [
    {
      name: "honganh-eyeshop",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: "./",
      // instances: "max",
      // exec_mode: "cluster",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1500M",
      env: {
        NODE_ENV: "proiuction",
      },
    },
    {
      name: "honganh-node-cron",
      script: "./server.mjs",
      interpreter: "node",
      node_args: "--no-warnings --experimental-modules",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
