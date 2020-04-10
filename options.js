let debug = true

log('Adding event listener for DOMContentLoaded.')
document.addEventListener('DOMContentLoaded', restoreOptions);

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

				var col1 = row.insertCell();
				col1.innerHTML = keyword

				var col2 = row.insertCell();
				col2.innerHTML = url;

				var col3 = row.insertCell();
				col3.innerHTML = "<button class=\"remove\">Remove</button>";
			}
		}

		// Get the current table body element.
		var oldTableBody = document.getElementById('tableBody');
		log('old table body:')
		log(oldTableBody)
		log('new table body:')
		log(newTableBody)

		if (oldTableBody) {
			// Replace table body with newly generated rows.
			oldTableBody.parentNode.replaceChild(newTableBody, oldTableBody)
		}
	});
}

log("Adding event listener for click event on addButton.")
document.getElementById('addButton').addEventListener("click", registerUrl);

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

				// Update the table.
				restoreOptions();
			});
		});
		
	} else {
		// One or more inputs were empty.
		log('Input was invalid.')
	}
}

function log(value) {
	if (!debug) return;
	console.log(value)
}

// // Saves options to chrome.storage
// function save_options() {
//   var color = document.getElementById('color').value;
//   var likesColor = document.getElementById('like').checked;
//   chrome.storage.sync.set({
//     favoriteColor: color,
//     likesColor: likesColor
//   }, function() {
//     // Update status to let user know options were saved.
//     var status = document.getElementById('status');
//     status.textContent = 'Options saved.';
//     setTimeout(function() {
//       status.textContent = '';
//     }, 750);
//   });
// }

// // Restores select box and checkbox state using the preferences
// // stored in chrome.storage.
// function restore_options() {
//   // Use default value color = 'red' and likesColor = true.
//   chrome.storage.sync.get({
//     favoriteColor: 'red',
//     likesColor: true
//   }, function(items) {
//     document.getElementById('color').value = items.favoriteColor;
//     document.getElementById('like').checked = items.likesColor;
//   });
// }
// document.addEventListener('DOMContentLoaded', restore_options);
// document.getElementById('save').addEventListener('click',
//     save_options);