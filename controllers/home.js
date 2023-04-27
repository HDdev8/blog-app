const homeRouter = require("express").Router();

homeRouter.get("/", async (req, res) => {
	res.send("Home");
});

module.exports = homeRouter;
