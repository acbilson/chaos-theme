export interface Response<T> {
	success: boolean;
	message: string;
	content: T;
}

export interface MastoAuthResult {
	authenticationUri: string;
}

export interface AuthResult {
	token: string;
}

export interface ChangeRequest {
	path: string;
	body: string;
	frontmatter: object;
	token: string;
}

export interface ChangeResult {
	path: string;
	body: string;
	frontmatter: object;
}

export interface PhotoResult {
	fileName: string;
	altText: string;
	caption: string;
}

export interface ChangeOption {
	key: string;
	name: string;
	value: SupportedPanelTypes;
	type: PanelOptionType;
	required: boolean;
}

export type SupportedPanelTypes = string | string[] | boolean;

export enum PanelStatus {
	CREATING = "Create",
	EDITING = "Edit",
	SAVING = "Save",
}

export enum PanelOptionType {
	TEXT = "text",
	LIST = "list",
	BOOLEAN = "boolean",
	FILE = "file",
}

export enum PanelType {
	PLANT = "plant",
	QUIP = "quip",
	LOG = "log",
	STONE = "stone",
}
