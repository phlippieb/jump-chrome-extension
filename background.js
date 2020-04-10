let links = {}
let maxNumberOfSuggestedLinks = 3;

// Update links if storage changes.
chrome.storage.onChanged.addListener(function () {
	loadLinksFromStorage();
});

// Update the links from store.
function loadLinksFromStorage() {
	// Get the updated items.
	chrome.storage.sync.get({
		// Default values: empty list.
		registeredLinks: []
	}, function (items) {
		// Reset local links.
		links = {}

		// Restore links from storage.
		let registeredLinks = items.registeredLinks;
		for (key in registeredLinks) {
			registeredLink = registeredLinks[key];
			let keyword = registeredLink.keyword;
			let url = registeredLink.url
			url = registeredLink.url;
			if (keyword && url) {
				links[keyword] = url;
			}
		}
	});
}

// Don't think this works.
chrome.omnibox.onInputStarted.addListener(function () {
	loadLinksFromStorage();
	updateTopSuggestion('');
});

loadLinksFromStorage();

// Runs when the user types.
// Updates the suggestions underneath the typed text.
chrome.omnibox.onInputChanged.addListener(function (text, suggest) {
	updateTopSuggestion(text)

	let suggestions = sortedMatches(text)
		.filter(function (value, index) { return index != 0; })
		.map(function (keyword) { return makeSuggestion(text, keyword, true); });
	suggest(suggestions);
});

function updateTopSuggestion(text) {
	if (text.trim() != '', links[text] || closestMatch(text)) {
		var keyword = '';
		if (links[text]) { keyword = text; }
		else { keyword = closestMatch(text); }

		let suggestion = makeSuggestion(text, keyword, false);
		chrome.omnibox.setDefaultSuggestion(suggestion);

	} else {
		let descriptionPrefix = (text == ',') ? '' : 'No matches. '
		let suggestion = makeSuggestion(',', ',', false, descriptionPrefix + 'Edit jump options.');
		chrome.omnibox.setDefaultSuggestion(suggestion)
	}
}

// Make a suggestion object.
// - Parameter text: The text entered by the user. May be a partial match for the keyword.
// - Parameter keyword: The full keyword for the suggestion.
// - Parameter includeContent: If false, result will not have a content field. Set to false when setting the default suggestion.
function makeSuggestion(text, keyword, includeContent, nonUrlDescription = null) {
	let keywordComponent = ''
	if (text == keyword) {
		// Show the full keyword as a match.
		keywordComponent = '<match>' + text + '</match>'
	} else if (keyword.includes(text)) {
		// Dim the full keyword, and highlight the text part that matches.
		keywordComponent = "<dim>" + keyword + "</dim>"
		keywordComponent = keywordComponent.replace(text, "</dim><match>" + text + "</match><dim>")
	} else {
		// Dim the full keyword.
		keywordComponent = "<dim>" + keyword + "</dim>"
	}

	// Build the suggestion description.
	let description = "jump"
	description += " <dim>|</dim> "
	description += keywordComponent 
	description += " <dim>|</dim> "
	if (nonUrlDescription) {
		description += nonUrlDescription
	} else {
		description += "<url>" + links[keyword] + "</url>"
	}

	return (includeContent)
		? { content: keyword, description: description }
		: { description: description }
}

// Runs when the user selects (presses enter) a link.
chrome.omnibox.onInputEntered.addListener(
	function (text) {
		if (text == ',') {
			navigateToOptions()

		} else if (links[text]) {
			console.log('found exact match!');
			navigate(links[text])

		} else if (closestMatch(text)) {
			console.log('found top match!:')
			navigate(links[closestMatch(text)]);
		}
	}
);

function navigateToOptions() {
	if (chrome.runtime.openOptionsPage) {
		chrome.runtime.openOptionsPage();
	} else {
		window.open(chrome.runtime.getURL('options.html'));
	}
}

function navigate(url) {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.update(tabs[0].id, { url: url });
	});
}

// Returns the most similar keyword to the given text, if any.
function closestMatch(text) {
	// Use exact match, if any (should be quicker to compute.)
	if (links[text]) {
		return text

	} else {
		// Sort all keywords by similarity, and return the first one, if any.
		matches = sortedMatches(text)
		return matches[0]
	}
}

// Returns an array of keywords, sorted by similarity to the given text.
// Result excludes keywords that are too dissimilar to the given text, and may be empty.
function sortedMatches(text) {
	return Object.keys(links)
		.map(function (keyword) {
			return {
				// Determine similarity to text for each keyword.
				keyword: keyword,
				similarity: similarity(text, keyword)
			}
		})
		.filter(function (value) {
			// Exclude totally dissimilar keywords.
			return value.similarity > 0
		})
		.sort(function (lhs, rhs) {
			// Sort keywords by most similar.
			return lhs.similarity > rhs.similarity
		})
		.map(function (value) {
			return value.keyword
		})
}

// Levenshtein distance
function similarity(s1, s2) {
	var longer = s1;
	var shorter = s2;
	if (s1.length < s2.length) {
		longer = s2;
		shorter = s1;
	}
	var longerLength = longer.length;
	if (longerLength == 0) {
		return 1.0;
	}
	return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
	s1 = s1.toLowerCase();
	s2 = s2.toLowerCase();

	var costs = new Array();
	for (var i = 0; i <= s1.length; i++) {
		var lastValue = i;
		for (var j = 0; j <= s2.length; j++) {
			if (i == 0)
				costs[j] = j;
			else {
				if (j > 0) {
					var newValue = costs[j - 1];
					if (s1.charAt(i - 1) != s2.charAt(j - 1))
						newValue = Math.min(Math.min(newValue, lastValue),
							costs[j]) + 1;
					costs[j - 1] = lastValue;
					lastValue = newValue;
				}
			}
		}
		if (i > 0)
			costs[s2.length] = lastValue;
	}
	return costs[s2.length];
}