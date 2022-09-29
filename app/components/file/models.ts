export interface Response<T> {
	success: boolean;
	message: string;
	result: T;
}

export interface ChangeResult {
	path: string;
	body: string;
	frontmatter: object;
}

export interface ChangeOption {
	name: string;
	value: string;
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
