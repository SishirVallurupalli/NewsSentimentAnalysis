const aposToLexForm = require('apos-to-lex-form');
const natural = require('natural');
const SpellCorrector = require('spelling-corrector');
const SW = require('stopword');

const spellCorrector = new SpellCorrector();
const { WordTokenizer, SentimentAnalyzer, PorterStemmer } = natural;
const tokenizer = new WordTokenizer();

const sentimentAnalysis = (message) => {
	if (!message.trim()) {
		return 0;
	}

	const lexed = aposToLexForm(message)
		.toLowerCase()
		.replace(/[^a-zA-Z\s]+/g, '');
	const tokenized = tokenizer.tokenize(lexed);
	tokenized.forEach((word, index) => {
		tokenized[index] = spellCorrector.correct(word);
	});

	const filteredReview = SW.removeStopwords(tokenized);

	const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
	const analysis = analyzer.getSentiment(filteredReview);

	return analysis;
};

module.exports = { sentimentAnalysis };
