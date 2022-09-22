export interface Response<T> {
	success: boolean;
	message: string;
	result: T;
}

export interface ChangeResult {
	content: string;
	options: ChangeOption[];
}

export interface ChangeOption {
	name: string;
	value: string;
	required: boolean;
}

export interface ReadResult {
	filePath: string;
	content: string;
}

export enum PanelStatus {
	CREATING = "Create",
	EDITING = "Edit",
}
