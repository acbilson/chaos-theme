export interface BacklinkDetail {
	href: string;
	panel: "main" | "aside";
}

export enum BacklinkEvents {
	CLICK = "backlink-clicked"
}
