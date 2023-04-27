const config = require("./utils/config");
const express = require("express");
const helmet = require("helmet");
const app = express();
const cors = require("cors");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
require("express-async-errors");

const middleware = require("./utils/middleware");
const homeRouter = require("./controllers/home");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

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

app.use("/", homeRouter);
app.use("/api/blogs", middleware.userExtractor, blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;