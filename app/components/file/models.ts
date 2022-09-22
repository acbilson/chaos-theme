export interface Response<T> {
	success: boolean;
	message: string;
	result: T;
}

export interface ChangeResult {
	filePath: string;
	content: string;
}

export interface ReadResult {
	filePath: string;
	content: string;
}

export enum PanelStatus {
	CREATING = "Create",
	EDITING = "Edit",
}
