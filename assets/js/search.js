function displayResults(results, store) {
	const searchResults = document.getElementById("results");
	if (results.length) {
		let resultList = "";
		// Iterate and build result list elements
		for (const i in results) {
			const id = results[i].ref;
			const item = store.find(x => x.id === id);
			resultList +=
				'<li><p><span style="padding-right: 9px;">' + item.author + '</span><a href="' + item.id + '">' + item.title + "</a></p>";
			resultList += "<p>" + item.content.substring(0, 100) + "...</p></li>";
		}
		searchResults.innerHTML = resultList;
	} else {
		searchResults.innerHTML = "No results found.";
	}
}

// Get the query parameter(s)
const params = new URLSearchParams(window.location.search);
const query = params.get("query");

// Perform a search if there is a query
if (query) {
	// Retain the search input in the form when displaying results
	document.getElementById("search-input").setAttribute("value", query);

	/*
	const idx = lunr(function () {
		this.ref("id");
		this.field("title", {
			boost: 15,
		});
		this.field("tags");
		this.field("content", {
			boost: 10,
		});

		for (const key in window.store) {
			this.add({
				id: key,
				title: window.store[key].title,
				tags: window.store[key].category,
				content: window.store[key].content,
			});
		}
	});
	*/

	/*

	parser = new DOMParser();
	fetch('/json/index.html')
		.then((r) => (r.status === 200 ? r.text() : ""))
		.then((r) => (parser.parseFromString(r, 'text/html')))
		.then(r => {
			const data = JSON.parse(r.body.innerText);
			console.log({lunr, data});

			const idx = lunr(function () {
				this.ref("id");
				this.field("title", {
					boost: 15,
				});
				//this.field("tags");
				this.field("content", {
					boost: 10,
				});

				for (var i in data) {
					this.add({
						id: data[i].id,
						title: data[i].title,
						//tags: window.store[key].category,
						content: data[i].content,
					});
				}
			});

			//lunr.Index.load(data);

			// Perform the search
			const results = idx.search(query);
			console.log({index: data, idx, query, results});
			// Update the list with results
			displayResults(results, data);
		});
		*/

	fetch('https://index.alexbilson.dev/index')
		.then((r) => (r.status === 200 ? r.json() : ""))
		.then((data) => {

			const idx = lunr(function () {
				this.ref("id");
				this.field("title", {
					boost: 15,
				});
				//this.field("tags");
				this.field("content", {
					boost: 10,
				});

				for (var i in data) {
					this.add({
						id: data[i].id,
						title: data[i].title,
						author: data[i].author,
						content: data[i].content,
					});
				}
			});

			// Perform the search
			const results = idx.search(query);
			console.log({index: data, idx, query, results});
			// Update the list with results
			displayResults(results, data);

		});

}
