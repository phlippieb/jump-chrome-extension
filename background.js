console.log('Started.')
// Constants

let links = {}

let maxNumberOfSuggestedLinks = 3;

// Update links if storage changes.
chrome.storage.onChanged.addListener(function () {
	loadLinksFromStorage();
});

// Update the links from store.
function loadLinksFromStorage() {
	console.log('Loading links from storage...')
	// Get the updated items.
	chrome.storage.sync.get({
		// Default values: empty list.
		registeredLinks: []
	}, function (items) {
		console.log('Fetched registered links:')
		console.log(items)
		// Reset local links.
		links = {}
		
		// Restore links from storage.
		let registeredLinks = items.registeredLinks;
		for (key in registeredLinks) {
			registeredLink = registeredLinks[key];
			console.log('\nregistered link:')
			console.log(registeredLink)
			let keyword = registeredLink.keyword;
			console.log(keyword)
			let url = registeredLink.url
			console.log(url)
			url = registeredLink.url;
			if (keyword && url) {
				links[keyword] = url;
			}
		}
		console.log('links after restore:')
		console.log(links)
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
	console.log('change')
	updateTopSuggestion(text)

	var suggestions = []
	var numberOfSuggestedLinks = 0
	for (key in links) {
		if (key == text) {
			// Skip this one.

		} else if (text != '' && key.includes(text)) {
			// Suggest this one.
			description = '<dim>' + key + '</dim>'
			description = description.replace(text, '</dim><match>' + text + '</match><dim>')
			description += ' <dim> ▷ </dim> '
			description += ' <url>' + links[key] + '</url>'

			suggestion = {
				content: key,
				description: description
			}
			suggestions.push(suggestion)

			// Only show 3 suggestions.
			numberOfSuggestedLinks++;
			if (numberOfSuggestedLinks >= maxNumberOfSuggestedLinks) {
				break;
			}

		} else {
			// Skip this one.
		}
	}

	// Add suggestion for settings page.
	optionsDescription = "<dim>,</dim>"
	optionsDescription += ' <dim> ▷ </dim> '
	optionsDescription += " Jump options"
	optionsSuggestion = {
		content: ",",
		description: optionsDescription
	}
	suggestions.push(optionsSuggestion)

	suggest(suggestions)
});

function updateTopSuggestion(text) {
	if (text.trim() == '') {
		// Nothing is entered. Show the help message? Or clear the suggestion?
		defaultSuggestion = '<dim>No matches. Enter "," to edit settings.</dim>'
		chrome.omnibox.setDefaultSuggestion({ description: defaultSuggestion })

	} else if (links[text]) {
		// User entered a valid keyword. Show its url.
		defaultSuggestion = '<match>' + text + '</match>'
		defaultSuggestion += ' <dim> ▶︎ </dim> '
		defaultSuggestion += ' <url>' + links[text] + '</url>'
		chrome.omnibox.setDefaultSuggestion({ description: defaultSuggestion })

	} else if (text == ',') {
		// User entered a valid keyword. Show its url.
		defaultSuggestion = '<match>,</match>'
		defaultSuggestion += ' <dim> ▶︎ </dim>'
		defaultSuggestion += ' Jump options'
		chrome.omnibox.setDefaultSuggestion({ description: defaultSuggestion })

	} else {
		// User entered something that isn't a valid keyword. Hide the default suggestion.
		defaultSuggestion = '<dim>No matches. Enter "," to edit settings.</dim>'
		chrome.omnibox.setDefaultSuggestion({ description: defaultSuggestion })
	}
}

// Runs when the user selects (presses enter) a link.
chrome.omnibox.onInputEntered.addListener(
	function (text) {
		if (text == ',') {
			navigateToOptions()
		}

		let selectedLink = links[text]
		if (selectedLink) {
			navigate(selectedLink)
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
