// Constants

// TODO: make this configurable from a menu.
let links = {
	"home": "https://github.com/phlippieb/jump-chrome-extension"
}

chrome.omnibox.onInputStarted.addListener(
	function() {
		updateTopSuggestion('')
	}
)

// Runs when the user types.
// Updates the suggestions underneath the typed text.
chrome.omnibox.onInputChanged.addListener(
	function(text, suggest) {
		updateTopSuggestion(text)
		
		var suggestions = []
		for (key in links) {
			if (key == text) {
				// Skip this one.
			
			} else if (key.includes(text)) {
				// Suggest this one.
				description = '<dim>' + key + '</dim>'
				description = description.replace(text, '</dim><match>' + text + '</match><dim>')
				description += ' <url>' + links[key] + '</url>'
				
				suggestion = {
					content: key,
					description: description
				}
				suggestions.push(suggestion)
			
			} else {
				// Skip this one.
			}
		}
		
		suggest(suggestions)
	}
)

function updateTopSuggestion(text) {
	if (text.trim() == '') {
		// Nothing is entered. Show the help message? Or clear the suggestion?
		defaultSuggestion = '<dim>No matches</dim>'
		chrome.omnibox.setDefaultSuggestion({ description: defaultSuggestion })
	
	} else if (links[text]) {
		// User entered a valid keyword. Show its url.
		defaultSuggestion = '<match>' + text + '</match>'
		defaultSuggestion += ' <dim> ▶︎ </dim>'
		defaultSuggestion += ' jump to'
		defaultSuggestion += ' <url>' + links[text] + '</url>'
		chrome.omnibox.setDefaultSuggestion({ description: defaultSuggestion })
		
		// TODO: get best suggestion for text and 'select' that.
	
	} else {
		// User entered something that isn't a valid keyword. Hide the default suggestion.
		defaultSuggestion = '<dim>No matches</dim>'
		chrome.omnibox.setDefaultSuggestion({ description: defaultSuggestion })
	}
}

// Runs when the user selects (presses enter) a link.
chrome.omnibox.onInputEntered.addListener(
	function (text) {
		let selectedLink = links[text]
		if (selectedLink) {
			navigate(selectedLink)
		
		} else {
			// TODO: go to top result if any?
		}
	}
);

function navigate(url) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.update(tabs[0].id, {url: url});
	});
 }
 