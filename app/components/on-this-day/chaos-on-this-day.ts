export class ChaosOnThisDay extends HTMLElement {
	visible: boolean;
	template: HTMLElement;
	articles: HTMLElement[];

	get logFeedUrl(): URL {
		return new URL(window.location.origin + "/logs/index.xml");
	}

	get logUrl(): URL {
		return new URL(window.location.origin + "/logs");
	}

	get container(): HTMLElement {
		return this.querySelector("#on-this-day");
	}

	get button(): HTMLButtonElement {
		return this.querySelector("button");
	}

	hide() {
		this.articles.forEach((x) => this.container.removeChild(x));
		this.visible = false;
		this.container.hidden = true;
		this.button.innerText = "Show On This Day";
	}

	show(articles: HTMLElement[]) {
		articles.forEach((x) => this.container.appendChild(x));
		this.visible = true;
		this.container.hidden = false;
		this.button.innerText = "Hide On This Day";
	}

	fetchArticleTemplate(): Promise<HTMLElement> {
		const parser = new DOMParser();

		return fetch(this.logUrl)
			.then((x) => x.text())
			.then((x) => parser.parseFromString(x, "text/html"))
			.then((logsDOM: HTMLDocument) => {
				return <HTMLElement>logsDOM.querySelector("article").cloneNode(true);
			});
	}

	fetchLogFeed(): Promise<XMLDocument> {
		const parser = new DOMParser();
		const today = new Date();

		const failedParse = (xml) =>
			xml.getElementsByTagName("parsererror")?.length !== 0;

		return fetch(this.logFeedUrl)
			.then((x) => x.text())
			.then((x) => parser.parseFromString(x, "text/xml"))
			.then((logsXml: XMLDocument) => {
				if (failedParse(logsXml)) {
					console.log(`Failed to load XML from ${this.logFeedUrl}`);
					return null;
				} else {
					return logsXml;
				}
			});
	}

	cloneArticle(item: any, template: HTMLElement): HTMLElement {
		const query = (s) => item.querySelector(s).firstChild.data;
		const toDate = (s) => new Date(query(s)).toISOString().substr(0, 10);

		// centers the new log instead
		template.classList.remove("wrapper-no-center");

		const attr = <HTMLUListElement>template.querySelector("header>ul");

		// removes all children except the header
		Array.from(template.children)
			.filter((el) => el.tagName.toLowerCase() !== "header")
			.forEach((el) => template.removeChild(el));

		(<HTMLTimeElement>attr.querySelector("time")).innerText = toDate("pubDate");
		(<HTMLAnchorElement>attr.querySelector("[rel='author']")).innerText =
			query("author");
		(<HTMLAnchorElement>attr.querySelector("[rel='bookmark']")).href =
			query("link");

		// appends new content
		template.innerHTML += query("description");

		return template;
	}

	async getPreviousLogs(): Promise<HTMLElement[]> {
		const parser = new DOMParser();
		const today = new Date();

		const failedParse = (xml) =>
			xml.getElementsByTagName("parsererror")?.length !== 0;

		const fromPreviousYear = (a: Date, b: Date) =>
			a.getFullYear() !== b.getFullYear() &&
			a.getMonth() === b.getMonth() &&
			a.getDate() === b.getDate();

		const noLogs = document.createElement("p");
		noLogs.innerText = `No previous logs on this date (${
			today.getMonth() + 1
		}/${today.getDate()})`;
		noLogs.classList.add("wrapper");

		const logsXml = await this.fetchLogFeed();
		const template = await this.fetchArticleTemplate();

		const articles = Array.from(logsXml.getElementsByTagName("pubDate"))
			.filter((el) => fromPreviousYear(today, new Date(el.innerHTML)))
			.map((el) =>
				this.cloneArticle(el.parentNode, <HTMLElement>template.cloneNode(true))
			);

		return articles.length > 0 ? articles : [noLogs];
	}

	async onClick(e: MouseEvent) {
		e.preventDefault();
		if (this.visible) {
			this.hide();
		} else {
			if (!this.articles) {
				this.getPreviousLogs().then((articles) => {
					this.articles = articles;
					this.show(articles);
				});
			} else {
				this.show(this.articles);
			}
		}
	}

	render() {
		this.innerHTML = `
			<aside class="flow-m">
				<button type="button">Show On This Day</button>
				<div id="on-this-day" class="wrapper no-h-padding | flow-m previous-cards" hidden>
				</div>
			</aside>
		`;
	}

	constructor() {
		super();
	}

	connectedCallback() {
		this.render();
		this.addEventListener("click", (e: MouseEvent) => this.onClick(e), false);
	}

	disconnectedCallback() {
		this.removeEventListener(
			"click",
			(e: MouseEvent) => this.onClick(e),
			false
		);
	}
}
