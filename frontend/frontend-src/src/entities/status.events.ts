export enum playerStatus {
	ONLINE,
	OFFLINE,
	IN_GAME
}

export interface updateDTO {
	userId: number;
	status: playerStatus;
}

export interface InterServerEvents {
	ping: () => void;
}

export interface ServerToClientEvents {
	update: (payload: updateDTO) => void;
}

export interface ClientToServerEvents {
	getStatus: (userId: number, callback: (status: playerStatus) => void) => void;
}
