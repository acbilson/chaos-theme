import { SearchService } from "../../services/search-service/search-service";
import { Response, SearchResult, SiteResult } from "../../services/models";
import {
	InjectionRequest,
	Instances,
	buildRequest,
} from "../../state/injector";

export class ChaosSearch extends HTMLElement {
	private _search: SearchService;

	private get searchContainer(): HTMLElement {
		return this.querySelector("ul#container") as HTMLElement;
	}

	private get sitesContainer(): HTMLElement {
		return this.querySelector("#sites") as HTMLElement;
	}

	private get queryElement(): HTMLInputElement {
		return this.querySelector("input#q") as HTMLInputElement;
	}

	get errorMsg(): string {
		return (<HTMLElement>this.querySelector("#error-message"))?.innerText || "";
	}

	set errorMsg(v: string) {
		(<HTMLElement>this.querySelector("#error-message")).innerText = v;
	}

	constructor() {
		super();
		this.render();
	}

	getQueryFromParams(): string {
		const params = new URLSearchParams(window.location.search);
		return params.get("q");
	}

	setSearchResults(results: SearchResult[]) {
		var resultElements = results.map((r) => {
			var t = document.createElement("template");
			t.innerHTML = `
			<li><p class="spread">
				<span>${r.author}</span>
				<a href="${r.id}">${r.title}</a>
				</p>
				${r.content}
			</li>`;
			return t.content.cloneNode(true);
		});
		this.searchContainer.replaceChildren(...resultElements);
	}

	getSites() {
		this._search.sites().then((r) => {
			if (r.success) {
				var sites = r.content.map((s) => {
					var t = document.createElement("template");
					t.innerHTML = `
					<tr>
						<td>${s.author}</td>
						<td>${s.url}</td>
						<td>${s.pages}</td>
					</tr>`;
					return t.content.cloneNode(true);
				});
				this.sitesContainer.replaceChildren(...sites);
			}
		});
	}

	queryBy(q: string) {
		if (!q) return;

		this._search.query(q).then(
			(r) => {
				if (r.success) {
					this.setSearchResults(r.content);
					this.updateParams(q);
				}
				this.errorMsg = r.message;
			},
			(e) => (this.errorMsg = e.toString())
		);
	}

	updateParams(q: string) {
		const params = new URLSearchParams();
		params.set("q", q);

		const newUrl = `${window.location.origin}${
			window.location.pathname
		}?${params.toString()}`;

		window.history.pushState({ path: newUrl }, "", newUrl);
	}

	onSubmit(e: SubmitEvent) {
		e.preventDefault();
		var q = this.queryElement.value;
		this.queryBy(q);
	}

	render() {
		this.innerHTML = `
		<div class="wrapper flow-s">
			<form class="spread">
				<input type="text" id="q" name="q" placeholder="Search my index..."></input>
				<button type="submit">Search</button>
			</form>

			<p id="error-message"></p>

			<details class="flow-m">
				<summary>Index Built From</summary>
				<table>
					<thead>
						<tr>
							<th>Author</th>
							<th>URL</th>
							<th>Page Count</th>
						</tr>
					</thead>
					<tbody id="sites"></tbody>
				</table>
			</details>

			<ul id="container" class="fill-list flow-s" role="list"></ul>
		</div>
		`;
	}

	connectedCallback() {
		const getSearch = buildRequest(<InjectionRequest>{
			instance: Instances.SEARCH,
			callback: (e) => (this._search = e),
		});

		this.dispatchEvent(getSearch);
		this.addEventListener(
			"submit",
			(e: SubmitEvent) => this.onSubmit(e),
			false
		);

		const q = this.getQueryFromParams();
		if (q) {
			this.queryElement.value = q;
			this.queryBy(q);
		}

		this.getSites();
	}

	disconnectedCallback() {
		this.removeEventListener(
			"submit",
			(e: SubmitEvent) => this.onSubmit(e),
			false
		);
	}
}
