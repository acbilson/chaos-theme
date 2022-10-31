import store from "../state/index";

interface Filter {
	key: string;
	value: string;
	comparator: "eq" | "gt";
}

export class ChaosFilter extends HTMLElement {
	private originalFields: HTMLElement[];

	// the form that gets placed into the chaos-filter-form slot
	private get formElement(): HTMLFormElement {
		return this.querySelector("[slot='chaos-filter-form']") as HTMLFormElement;
	}

	// all selectors in the form. Other input types not supported.
	private get selectors(): HTMLSelectElement[] {
		return Array.from(
			this.formElement.querySelectorAll("select")
		) as HTMLSelectElement[];
	}

	// a key-value set of all the possible filter matches and the user's current selection.
	// if the filter is set to "all", it will not be added to the filter list.
	// e.g. { key: 'folder', value: 'faith' }
	private get filters(): Filter[] {
		return this.selectors
			.map((x) => {
				return <Filter>{
					key: x.dataset.match,
					value: x.options[x.selectedIndex].value,
					comparator: x.dataset.comparator ?? "eq",
				};
			})
			.filter((x) => x.value !== "all");
	}

	// the first unordered list inside the chaos-filter-fields slot content, if
	// the slot isn't already an unordered list
	private get fieldsElement(): HTMLUListElement {
		const slot = this.querySelector(
			"[slot='chaos-filter-fields']"
		) as HTMLElement;

		return slot.tagName === "UL"
			? (slot as HTMLUListElement)
			: (slot.querySelector("ul") as HTMLUListElement);
	}

	// all of the fields available for sort
	private get fieldList(): HTMLLIElement[] {
		return Array.from(this.fieldsElement.children) as HTMLLIElement[];
	}

	// apply the filter against the original field list. Replace the children
	// in the DOM and notify that the field filter has changed.
	// the notice is used by the chaos-resizer to dictate a new widest field
	// and minimum width
	filterFields() {
		const filteredFields = this.originalFields.filter((field) =>
			this.filters.every((x) => {
				if (x.comparator === "eq") return field.dataset[x.key] === x.value;
				if (x.comparator === "gt")
					return Number(field.dataset[x.key]) > Number(x.value);
				return false;
			})
		);

		this.fieldsElement.replaceChildren(...filteredFields);
		store.onFieldFilter$.notify();
	}

	// updates the query string without reloading the page so my query
	// state persists with links
	updateParams() {
		const params = new URLSearchParams();
		this.filters.forEach((x) => params.set(x.key, x.value));

		// only adds query params if any exist
		const newUrl =
			Array.from(params.entries()).length > 0
				? `${window.location.origin}${
						window.location.pathname
				  }?${params.toString()}`
				: `${window.location.origin}${window.location.pathname}`;

		window.history.pushState({ path: newUrl }, "", newUrl);
	}

	// retrieve the current query params and update my select options
	// to point to what's been set in the URL.
	setFiltersFromParams() {
		const params = new URLSearchParams(window.location.search);
		this.selectors
			.filter((x) => params.has(x.dataset.match))
			.forEach((select) => {
				const match = params.get(select.dataset.match);
				const options = Array.from(select.options) as HTMLOptionElement[];
				select.selectedIndex = options.findIndex((x) => x.value === match);
			});
	}

	onSubmit(e: SubmitEvent) {
		e.preventDefault();
		this.filterFields();
		this.updateParams();
	}

	constructor() {
		super();

		const buildTemplate = () => {
			const t = document.createElement("template");
			t.innerHTML = `
			<slot name="chaos-filter-form"></slot>
			<slot name="chaos-filter-fields"></slot>
			`;
			return t.content;
		};

		this.attachShadow({ mode: "open" }).appendChild(
			buildTemplate().cloneNode(true)
		);

		// stores the original fields for easy filter generation
		this.originalFields = this.fieldList;

		this.setFiltersFromParams();
		this.filterFields();
	}

	connectedCallback() {
		this.addEventListener(
			"submit",
			(e: SubmitEvent) => this.onSubmit(e),
			false
		);
	}

	disconnectedCallback() {
		this.removeEventListener(
			"submit",
			(e: SubmitEvent) => this.onSubmit(e),
			false
		);
	}
}
