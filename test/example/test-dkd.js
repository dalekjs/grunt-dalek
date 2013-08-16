module.exports = {
	'dkd search page is accessible': function (test) {
		test
		.open('http://www.dkd.de')
		.assert.title().is('Development, Kommunikation, Design - Willkommen bei den TYPO3-Spezialisten der dkd Internet Service GmbH in Frankfurt', 'dkd has title')
		.type('#tx-solr-q', 'news')
		.click('input.search-btn')
		.assert.title().is('Suche', 'dkd search page')
		.screenshot('images/search.jpg')
		.done();
	},
	'search result for news has valid links': function (test) {
		test
		.open('http://www.dkd.de/de/suche/?tx_solr%5Bfilter%5D%5B0%5D=type%253Att_news&q=news')
		.assert.text('.tx-solr-results-list.search a').is('')
		.done();
	}
};