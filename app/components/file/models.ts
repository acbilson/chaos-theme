export interface Response<T> {
	success: boolean;
	message: string;
	content: T;
}

export interface ChangeResult {
	path: string;
	body: string;
	frontmatter: object;
}

export interface ChangeOption {
	key: string;
	name: string;
	value: string;
	type: PanelOptionType;
	required: boolean;
}

export interface ReadResult {
	filepath: string;
	frontmatter: object;
	body: string;
}

export enum PanelStatus {
	CREATING = "Create",
	EDITING = "Edit",
}

export enum PanelOptionType {
	TEXT = "text",
	LIST = "list",
}
