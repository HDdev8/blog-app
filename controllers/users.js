const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

usersRouter.get("/", async (req, res) => {
	const users = await User.find({});
	// const users = await User.find({}).populate("blogs", {title: 1, url: 1});
	res.json(users);
});

usersRouter.get("/:id", async (req, res) => {
	const user = await User.findById(req.params.id);
	if (user) {
		res.json(user);
	} else {
		res.status(404).end();
	}
});

usersRouter.post("/", async (req, res) => {
	const {username, name, password} = req.body;
	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(password, saltRounds);
	const user = new User({
		username,
		name,
		passwordHash,
	});
	const savedUser = await user.save();
	res.status(201).json(savedUser);
});

usersRouter.put("/:id", async (req, res) => {
	const body = req.body;
	const decodedToken = jwt.verify(req.token, process.env.SECRET);

	if (!decodedToken.id) {
		return res.status(401).json({error: "token invalid"});
	} else if (decodedToken.id) {
		const user = await User.findById(decodedToken.id);
		const userObject = {
			username: user.username,
			name: body.name,
			passwordHash: user.passwordHash,
		};
		const updatedUser = await User.findByIdAndUpdate(req.params.id, userObject, {
			new: true,
			runValidators: true,
			context: "query",
		});
		res.json(updatedUser);
	}
});

usersRouter.delete("/:id", async (req, res) => {
	await User.findByIdAndRemove(req.params.id);
	res.status(204).end();
});

module.exports = usersRouter;
