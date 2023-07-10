var express = require('express');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('Your API Key');
const nlp = require('./nlp');

var app = express();

app.get('/:title', async function (req, res) {
	let title = req.params.title;
	getArticles(title).then((articles) => {
		let sent = 0;
		articles.forEach((element) => {
			sent += nlp.sentimentAnalysis(element.description);
			console.log(sent);
		});
		res.status(200).json(sent);
	});
});

async function getArticles(title) {
	const prom = new Promise((resolve) => {
		newsapi.v2
			.everything({
				q: title,
				language: 'en',
			})
			.then((response) => {
				console.log(response.status);
				let articles = response.articles;
				resolve(articles);
			});
	});
	const articles = await prom;
	return articles;
}

var server = app.listen(8000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});
