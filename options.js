let debug = true

log('Adding event listener for DOMContentLoaded.')
document.addEventListener('DOMContentLoaded', onDomContentLoaded);

function onDomContentLoaded() {
	restoreOptions();
	
	log("Adding event listener for click event on addButton.");
	document.getElementById('addButton').addEventListener("click", registerUrl);
}

// Restores the user's options.
function restoreOptions() {
	log('Restoring options...')
	chrome.storage.sync.get({
		// Default values: empty list.
		registeredLinks: []

	}, function (items) {
		// Get the data to populate the table with.
		var registeredLinks = items.registeredLinks;
		log('Loaded registered links:');
		log(registeredLinks);

		// Create a new table body element.
		var newTableBody = document.createElement('tbody');
		newTableBody.id = 'tableBody'
		// These are stored as { 0: ..., 1:, ... } for some reason.
		for (key in registeredLinks) {
			let registeredLink = registeredLinks[key];
			// Get and check values.
			let keyword = registeredLink.keyword
			let url = registeredLink.url;
			if (keyword && url) {
				// Create and populate row.
				var row = newTableBody.insertRow();
				row.id = keyword

				var col1 = row.insertCell();
				col1.innerText = keyword

				var col2 = row.insertCell();
				col2.innerText = url;
				
				let removeButton = document.createElement('button');
				removeButton.id = keyword;
				removeButton.classList = "remove";
				removeButton.innerText = "Remove";
				
				var col3 = row.insertCell();
				col3.innerHTML = removeButton.outerHTML;
				
				col3.childNodes[0].addEventListener('click', function() { 
					unregisterUrl(keyword);
				});
			}
		}

		// Get the current table body element.
		var oldTableBody = document.getElementById('tableBody');
		
		// Replace table body with newly generated rows.
		if (oldTableBody) {
			oldTableBody.parentNode.replaceChild(newTableBody, oldTableBody)
		}
	});
}

// Registers a new URL.
function registerUrl() {
	log('Registering new url...');

	// Get and check the data entered by the user.
	var keywordInput = document.getElementById('keywordInput');
	var keyword = keywordInput.value;
	var urlInput = document.getElementById('urlInput');
	var url = urlInput.value;
	if (keyword && url) {
		var newLink = {
			keyword: keyword,
			url: url
		};
		log('Adding link:');
		log(newLink);

		// Get the existing data.
		chrome.storage.sync.get({
			// Default values: empty list.
			registeredLinks: []

		}, function (items) {
			// Create a new list of registered links with the new item added.
			// (Filter out empty items)
			var updatedRegisteredLinks = items.registeredLinks.filter(function(value) {
				let keyword = value.keyword;
				let url = value.url;
				if (keyword && url) {
					return keyword != '' && url != '';
				} else {
					return false;
				}
			});
			updatedRegisteredLinks.push(newLink);
			log('Updated links:');
			log(updatedRegisteredLinks);

			// Store the updated list of registered links.
			chrome.storage.sync.set({
				registeredLinks: updatedRegisteredLinks
			}, function () {
				// Update the page to indicate the changes.
				// Clear the inputs.
				keywordInput.value = "";
				urlInput.value = "";

				// Reload the table.
				restoreOptions();
			});
		});
		
	} else {
		// One or more inputs were empty.
		log('Input was invalid.')
	}
}

function unregisterUrl(keyword) {
	log('Unregistering keyword: ' + keyword);
	
	// Get current keywords.
	chrome.storage.sync.get({
		// Default values: empty list.
		registeredLinks: []

	}, function (items) {
		// Get the data to populate the table with.
		let updatedLinks = items.registeredLinks.filter(function(value) {
			return value.keyword != keyword;
		});
		
		// Store the updated links.
		chrome.storage.sync.set({
			registeredLinks: updatedLinks
		}, function () {
			// Reload the table.
			restoreOptions();
		});
	});
}

function log(value) {
	if (!debug) return;
	console.log(value)
}
