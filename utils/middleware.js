const jwt = require("jsonwebtoken");
const logger = require("./logger");
const User = require("../models/user");

const tokenExtractor = async (req, res, next) => {
	const authorization = await req.get("authorization");
	if (authorization && authorization.startsWith("Bearer ")) {
		req.token = authorization.replace("Bearer ", "");
	}
	next();
};

const userExtractor = async (req, res, next) => {
	if (req.method === "POST" || req.method === "PUT" || req.method === "DELETE") {
		const authToken = req.token;
		const decodedToken = jwt.verify(authToken, process.env.SECRET);

		if (decodedToken.id) {
			const username = decodedToken.username;
			req.user = await User.findOne({username});
		}
	}
	next();
};

const requestTime = (req, res, next) => {
	req.requestTime = new Date();
	logger.info("Request Time:", req.requestTime);
	next();
};

const requestLogger = (req, res, next) => {
	logger.info("Req Method: ", req.method);
	logger.info("Req Path: ", req.path);
	logger.info("Req Body: ", req.body);
	logger.info("---");
	next();
};

const unknownEndpoint = (req, res) => {
	res.status(404).send({error: "unknown endpoint"});
};

const errorHandler = (error, req, res, next) => {
	logger.info(error.name);
	logger.info(error.message);
	logger.error(error.message);

	if (error.name === "CastError") {
		return res.status(400).send({error: "malformatted id"});
	} else if (error.name === "ValidationError") {
		return res.status(400).json({error: error.message});
	} else if (error.name === "JsonWebTokenError") {
		return res.status(400).json({error: error.message});
	} else if (error.name === "TypeError") {
		return res.status(400).json({error: error.message});
	} else if (error.name === "TokenExpiredError") {
		return res.status(401).json({
			error: "token expired",
		});
	}

	next(error);
};

module.exports = {
	requestTime,
	requestLogger,
	unknownEndpoint,
	errorHandler,
	tokenExtractor,
	userExtractor,
};
