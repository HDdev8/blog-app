const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (req, res) => {
	const body = req.body;
	const {username, password} = body;
	const user = await User.findOne({username});
	const passwordMatch = user === null ? false : await bcrypt.compare(password, user.passwordHash);
	if (!user || !passwordMatch) {
		return res.status(401).json({
			error: "invalid username or password",
		});
	} else if (user && passwordMatch) {
		const userForToken = {
			username: user.username,
			id: user._id,
		};
		const token = jwt.sign(userForToken, process.env.SECRET, {expiresIn: 60 * 60});
		res.status(200).send({token, username: user.username, name: user.name});
	}
});

module.exports = loginRouter;
