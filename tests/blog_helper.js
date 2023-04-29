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

const testBlog1 = {
	title: "Another Test",
	author: "hddev8",
	url: "/api/blogs/Another-Test",
	likes: 26,
	user: {
		username: "hddev8",
		name: "HD Dev8",
		id: "644c3deb145da742e7aaad4e",
	},
	id: "644c60cb8ea86d46037c4a23",
};

const testBlog2 = {
	title: "Another Test",
	author: "hddev8",
	url: "/api/blogs/Another-Test",
	likes: 26,
	user: "644c60cb8ea86d46037c4a23",
};

const blogs1 = [
	{
		_id: "5a422a851b54a676234d17f7",
		title: "React patterns",
		author: "Michael Chan",
		url: "https://reactpatterns.com/",
		likes: 7,
		user: "644cb113a96739b67aa4474e",
		__v: 0,
	},
	{
		_id: "5a422aa71b54a676234d17f8",
		title: "Go To Statement Considered Harmful",
		author: "Edsger W. Dijkstra",
		url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
		likes: 5,
		user: "644cb113a96739b67aa4474e",
		__v: 0,
	},
	{
		_id: "5a422b3a1b54a676234d17f9",
		title: "Canonical string reduction",
		author: "Edsger W. Dijkstra",
		url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
		likes: 12,
		user: "644cb113a96739b67aa4474e",
		__v: 0,
	},
];
const blogs2 = [
	{
		_id: "5a422a851b54a676234d17f7",
		title: "React patterns",
		author: "Michael Chan",
		url: "https://reactpatterns.com/",
		likes: 7,
		user: "644cb226d0d3588400e46a60",
		__v: 0,
	},
	{
		_id: "5a422aa71b54a676234d17f8",
		title: "Go To Statement Considered Harmful",
		author: "Edsger W. Dijkstra",
		url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
		likes: 5,
		user: "644cb226d0d3588400e46a60",
		__v: 0,
	},
	{
		_id: "5a422b3a1b54a676234d17f9",
		title: "Canonical string reduction",
		author: "Edsger W. Dijkstra",
		url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
		likes: 12,
		user: "644cb226d0d3588400e46a60",
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
	blogs1,
	blogs2,
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes,
	listWithTwoBlogs,
	listWithOneBlog,
};
