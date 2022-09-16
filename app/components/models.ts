export interface EditPayload {
	fileType: string;
	fileName: string;
}

export interface EditResponse {
	filePath: string;
	fileContent: string[];
	matches: string[];
}

export interface UpdatePayload {
	fileContent: string;
	filePath: string;
}

export interface BacklinkDetail {
	href: string;
	panel: 'main' | 'aside';
}
