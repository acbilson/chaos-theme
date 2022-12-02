import { ChaosPanelOption } from "./chaos-panel-option";
import {
	Response,
	ChangeRequest,
	ChangeOption,
	PanelStatus,
	PanelType,
} from "../../services/models";
import {
	mapClass,
	getSimpleDate,
	getFilePathByDate,
} from "../../shared/operators";
import { PublishService } from "../../services/publish-service/publish-service";
import { Store } from "../../state/store";
import {
	InjectionRequest,
	Instances,
	buildRequest,
} from "../../state/injector";

export class ChaosPanel extends HTMLElement {
	private _pub: PublishService;
	private _store: Store;
	private _subscriptions = {
		auth: null,
		mastodon: null,
	};
	private _typesWithOptions = [PanelType.PLANT, PanelType.STONE];
	private _initialMarkup;
	_isNew = true;

	get isNew(): boolean {
		return this._isNew;
	}

	set isNew(v: boolean) {
		this._isNew = v;
		const editBtn = this.getButton(PanelStatus.EDITING);
		const createBtn = this.getButton(PanelStatus.CREATING);
		if (v) {
			editBtn.classList.remove("selected-panel-type");
			createBtn.classList.add("selected-panel-type");
		} else {
			editBtn.classList.add("selected-panel-type");
			createBtn.classList.remove("selected-panel-type");
		}
	}

	get panelType(): PanelType {
		return <PanelType>this.getAttribute("data-panel-type");
	}

	getButton(status: PanelStatus) {
		return <HTMLButtonElement>this.querySelector(`button#${status}`);
	}

	get panelOptions(): ChaosPanelOption[] {
		return <ChaosPanelOption[]>(
			Array.from(this.querySelectorAll("chaos-panel-option") || [])
		);
	}

	get syndicateOption(): ChaosPanelOption {
		return this.panelOptions.find((x) => x.key === "syndicate");
	}

	get contents(): string {
		return (<HTMLTextAreaElement>this.querySelector("textarea"))?.value || "";
	}

	set contents(v: string) {
		(<HTMLTextAreaElement>this.querySelector("textarea")).innerText = v;
	}

	get errorMsg(): string {
		return (<HTMLElement>this.querySelector("#error-message"))?.innerText || "";
	}

	set errorMsg(v: string) {
		(<HTMLElement>this.querySelector("#error-message")).innerText = v;
	}

	get frontmatter(): object {
		return this.panelOptions.length === 0
			? {}
			: this.panelOptions.reduce((prev, curr) => {
					const m = curr.getModel();
					if (m?.key && m?.value) {
						prev[m.key] = m.value;
					}
					return prev;
			  }, {});
	}

	private get filePath(): string {
		return document.location.pathname;
	}

	private get shouldHaveOptions(): boolean {
		return this._typesWithOptions.includes(this.panelType);
	}

	updateChaosPanelOptions(path: string, frontmatter: object) {
		const options = this.panelOptions;
		const optionByAttr = (a) =>
			options.find((x) => x.getAttribute("data-key") === a);

		// update path
		const pathOption = optionByAttr("path");
		if (pathOption) {
			pathOption.value = path;
			pathOption.readonly = true;
		}

		// update front matter options
		Object.keys(frontmatter).forEach((k) => {
			const o = optionByAttr(k);
			if (o) {
				o.value = frontmatter[k];
			}
		});
	}

	clearChaosPanelOptions() {
		const options = this.panelOptions;
		options.forEach((o) => (o.value = null));
	}

	startUpdate() {
		return this._pub.read(this._store.token, this.filePath).then((r) => {
			if (r.success) {
				this.contents = r.content.body;
				this.updateChaosPanelOptions(r.content.path, r.content.frontmatter);
				this.isNew = false;
			} else {
				this.errorMsg = r.message;
			}
		});
	}

	startCreate() {
		this.contents = "";
		this.clearChaosPanelOptions();
		this.isNew = true;
	}

	updateFile() {
		const frontmatter = this.frontmatter;

		// sets the path based on type
		let path: string;
		if ("path" in frontmatter) {
			path = frontmatter["path"];
			delete frontmatter["path"];
		} else {
			if (!this.shouldHaveOptions) path = this.getFilePath();
		}

		frontmatter["lastmod"] = new Date().toISOString();

		return this._pub
			.update(this._store.token, <ChangeRequest>{
				body: this.contents,
				token: this._store.mastodonToken,
				path,
				frontmatter,
			})
			.then(
				(r) => {
					if (r.success) {
						this.contents = r.content.body;
						this.errorMsg = "success";
					} else {
						this.errorMsg = r.message;
					}
				},
				(e) => (this.errorMsg = e.toString())
			);
	}

	getFilePath(): string {
		switch (this.panelType) {
			case PanelType.PLANT:
			case PanelType.STONE:
			default:
				return this.filePath;
			case PanelType.QUIP:
			case PanelType.LOG:
				return getFilePathByDate(this.panelType);
		}
	}

	createFile() {
		const frontmatter = this.frontmatter;

		// sets the path based on type
		let path: string;
		if ("path" in frontmatter && this.shouldHaveOptions) {
			path = frontmatter["path"];
			delete frontmatter["path"];
		} else {
			path = this.getFilePath();
		}

		const now = new Date();
		frontmatter["date"] = getSimpleDate(now);
		frontmatter["lastmod"] = now.toISOString();

		this._pub
			.create(this._store.token, <ChangeRequest>{
				body: this.contents,
				token: this._store.mastodonToken,
				frontmatter,
				path,
			})
			.then(
				(r) => {
					if (r.success) {
						this.contents = r.content.body;
						this.updateChaosPanelOptions(r.content.path, r.content.frontmatter);
						this.errorMsg = r.message;
					}
					this.errorMsg = r.message;
				},
				(e) => (this.errorMsg = e.toString())
			);
	}

	validate(): boolean {
		const options = this.panelOptions.map((x) => x.getModel());
		const missingRequiredValues = options
			.filter((x) => x.required)
			.some((x) => !x.value);

		if (this.shouldHaveOptions && missingRequiredValues) {
			this.errorMsg = "Not all required fields have values";
			return false;
		}

		return true;
	}

	render() {
		const panelButtons = Object.keys(PanelStatus)
			.map((k) => {
				return `<button id="${PanelStatus[k]}"
				${PanelStatus[k] == PanelStatus.SAVING ? 'type="submit" disabled' : ""}
				>${PanelStatus[k]}</button>`;
			})
			.join("");

		return `
			<form class="wrapper">
				<fieldset id="panel-buttons">
					${panelButtons}
				</fieldset>
				<fieldset>${this._initialMarkup}</fieldset>
				<p id="error-message"></p>
				<textarea>${this.contents}</textarea>
			</form>
		`;
	}

	onButtonClick(e: SubmitEvent) {
		e.preventDefault();
		const btn = <HTMLButtonElement>e.submitter;
		const status = btn.id as PanelStatus;
		switch (status) {
			case PanelStatus.CREATING:
				this.startCreate();
				break;
			case PanelStatus.EDITING:
				this.startUpdate();
				break;
			case PanelStatus.SAVING:
				if (this.validate()) {
					if (this.isNew) {
						this.createFile();
					} else {
						this.updateFile();
					}
				}
				break;
			default:
				this.errorMsg = `selected an unknown button status`;
		}
	}

	onKeyUp(e: KeyboardEvent) {
		e.preventDefault();
		const el = <HTMLTextAreaElement>e.target;
		this.getButton(PanelStatus.SAVING).disabled = el.value.length <= 0;
	}

	constructor() {
		super();
		this._initialMarkup = this.innerHTML;
		this.innerHTML = "";
	}

	connectedCallback() {
		const getPublish = buildRequest(<InjectionRequest>{
			instance: Instances.PUBLISH,
			callback: (e) => (this._pub = e),
		});

		const getStore = buildRequest(<InjectionRequest>{
			instance: Instances.STORE,
			callback: (e) => (this._store = e),
		});

		this.dispatchEvent(getPublish);
		this.dispatchEvent(getStore);

		this._subscriptions.auth = this._store.isAuthorized$.subscribe(
			"chaos-panel",
			(isAuth) => {
				if (isAuth) {
					this.innerHTML = this.render();
				} else {
					this.innerHTML = `<span hidden>Not authorized to view panel</span>`;
				}
			}
		);

		// if syndication is an available option, make it readonly if
		// I don't currently have authorization
		if (this.syndicateOption) {
			this._subscriptions.mastodon =
				this._store.isMastodonAuthorized$.subscribe(
					"chaos-panel",
					(isAuth) => (this.syndicateOption.readonly = !isAuth)
				);
		}

		this.addEventListener("submit", (e) => this.onButtonClick(e));
		this.addEventListener("keyup", (e) => this.onKeyUp(e));
	}

	disconnectedCallback() {
		this._store.isAuthorized$.unsubscribe(this._subscriptions.auth);
		this._store.isMastodonAuthorized$.unsubscribe(this._subscriptions.mastodon);
		this.removeEventListener("submit", (e) => this.onButtonClick(e));
		this.removeEventListener("keyup", (e) => this.onKeyUp(e));
	}
}
