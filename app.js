const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const logger = require("./utils/logger");
require("express-async-errors");

const middleware = require("./utils/middleware");
const loginRouter = require("./controllers/login");
const usersRouter = require("./controllers/users");
const blogsRouter = require("./controllers/blogs");

mongoose.set("strictQuery", false);

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(helmet());
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

app.use(middleware.requestTime);
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use("/api/login", loginRouter);
app.use("/api/users", usersRouter);
app.use("/api/blogs", middleware.userExtractor, blogsRouter);

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
