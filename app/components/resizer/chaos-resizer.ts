import store from "../../state/index";

// resizes a list where each list item has two children
export class ChaosResizer extends HTMLElement {
	private resizer: ResizeObserver;
	private widestField: HTMLElement;
	private minimumWidth: number;
	private _subscription: string;

	private get fieldList(): HTMLUListElement {
		return this.querySelector("ul") as HTMLUListElement;
	}

	private get fields(): HTMLLIElement[] {
		return Array.from(this.fieldList.querySelectorAll("li")) as HTMLLIElement[];
	}

	// sets the widest field and minimum width state
	private setFieldAndWidth() {
		const widestField = [...this.fields]
			.map((x) => {
				const itemPair = Array.from(x.children);
				return { parent: x, attr: itemPair[0], title: itemPair[1] };
			})
			.sort((a, b) => a.title.scrollWidth - b.title.scrollWidth)
			.pop();

		this.minimumWidth =
			widestField.attr.scrollWidth + widestField.title.scrollWidth;

		this.widestField = widestField.parent;
	}

	constructor() {
		super();

		this.setFieldAndWidth();

		// swaps the class on the parent ul element when the widest child
		// gets too big to render on one line. Wide uses flex-direction: row while
		// narrow uses flex-direction: columnn. Fires on every resize.
		this.resizer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const parentWidth = entry.contentBoxSize[0].inlineSize;
				const tooSmall = parentWidth <= this.minimumWidth;

				if (tooSmall && this.fieldList.classList.contains("filter-wide")) {
					this.fieldList.classList.remove("filter-wide");
					this.fieldList.classList.add("filter-narrow");
				}
				if (!tooSmall && this.fieldList.classList.contains("filter-narrow")) {
					this.fieldList.classList.remove("filter-narrow");
					this.fieldList.classList.add("filter-wide");
				}
			}
		});
	}

	connectedCallback() {
		// subscribes to changes in the field list. Currently changes when the filter
		// adjusts the field list items. Toggles the observable fields to avoid
		// watching a list item that's dropped to zero width.
		this._subscription = store.onFieldFilter$.subscribe("chaos-resizer", () => {
			this.resizer.unobserve(this.widestField);
			this.setFieldAndWidth();
			this.resizer.observe(this.widestField);
		});
		this.resizer.observe(this.widestField);
	}

	disconnectedCallback() {
		this.resizer.unobserve(this.widestField);
		store.onFieldFilter$.unsubscribe(this._subscription);
	}
}
