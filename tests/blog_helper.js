const listWithOneBlog = [
	{
		_id: "5a422a851b54a676234d17f7",
		title: "React patterns",
		author: "Michael Chan",
		url: "https://reactpatterns.com/",
		likes: 7,
		__v: 0,
	},
];

const listWithTwoBlogs = [
	{
		_id: "5a422aa71b54a676234d17f8",
		title: "Go To Statement Considered Harmful",
		author: "Edsger W. Dijkstra",
		url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
		likes: 5,
		__v: 0,
	},
	{
		_id: "5a422b891b54a676234d17fa",
		title: "First class tests",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
		likes: 10,
		__v: 0,
	},
];

const blogs = [
	{
		_id: "5a422a851b54a676234d17f7",
		title: "React patterns",
		author: "Michael Chan",
		url: "https://reactpatterns.com/",
		likes: 7,
		__v: 0,
	},
	{
		_id: "5a422aa71b54a676234d17f8",
		title: "Go To Statement Considered Harmful",
		author: "Edsger W. Dijkstra",
		url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
		likes: 5,
		__v: 0,
	},
	{
		_id: "5a422b3a1b54a676234d17f9",
		title: "Canonical string reduction",
		author: "Edsger W. Dijkstra",
		url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
		likes: 12,
		__v: 0,
	},
	{
		_id: "5a422b891b54a676234d17fa",
		title: "First class tests",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
		likes: 10,
		__v: 0,
	},
	{
		_id: "5a422ba71b54a676234d17fb",
		title: "TDD harms architecture",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
		likes: 0,
		__v: 0,
	},
	{
		_id: "5a422bc61b54a676234d17fc",
		title: "Type wars",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
		likes: 2,
		__v: 0,
	},
];

const dummy = (blogs) => {
	return blogs.length === 0 ? (blogs.length = 1) : (blogs.length = 1);
};

const totalLikes = (blogs) => {
	const pluck = (objs, key) => objs.map((obj) => obj[key]);
	let likesArray = pluck(blogs, "likes");
	return likesArray.reduce((a, b) => a + b);
};

const favoriteBlog = (blogs) => {
	const sortBy = (arr, key) => arr.sort((a, b) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0));
	const sorted = sortBy([...blogs], "likes");
	return sorted[sorted.length - 1];
};

const mostBlogs = (blogList) => {
	const listCopy = [...blogList];
	const countBy = (arr, fn) =>
		arr.map(typeof fn === "function" ? fn : (val) => val[fn]).reduce((acc, val) => {
			acc[val] = (acc[val] || 0) + 1;
			return acc;
		}, {});
	const counted = countBy([...listCopy], "author");
	const authorArray = Object.entries(counted);
	const [a, b] = authorArray[authorArray.length - 1];
	return {
		author: a,
		blogs: b,
	};
};

const mostLikes = (blogList) => {
	const sortBy = (arr, key) => arr.sort((a, b) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0));
	const sorted = sortBy([...blogList], "likes");
	const author = sorted[sorted.length - 1];
	return {
		author: author.author,
		likes: author.likes,
	};
};

module.exports = {
	blogs,
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes,
	listWithTwoBlogs,
	listWithOneBlog,
};
