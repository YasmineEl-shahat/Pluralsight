// Use CommonJS require below so we can dynamically import during build-time.
if (process.env.NODE_ENV === "production") {
  module.exports = require("./configureStore.prod");
} else {
  module.exports = require("./configureStore.dev");
}
// This pattern assures that our dev‑related store configuration code isn't included in our production bundle. 