const { createServer } = require("./src/presentation/server");

// Keep a strong reference to the HTTP server in watch mode.
const runtime = createServer();

module.exports = runtime;

// Keep the process alive when run directly (not as a required module)
if (require.main === module) {
  // Process will stay alive as long as the HTTP server is listening
  process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down...");
    runtime.server?.close(() => process.exit(0));
  });
}
