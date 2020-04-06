export enum TypeMessage {
	AddFrame = 'AddFrame',
	Start = 'Start',
	Save = 'Save',
	Abort = 'Abort',
}

export interface StartMessage {
	type: TypeMessage.Start;
	sketchName: string;
}

export interface SaveMessage {
	type: TypeMessage.Save;
}

export interface AddFrameMessage {
	type: TypeMessage.AddFrame;
	image: string;
}

export interface AbortMessage {
	type: TypeMessage.Abort;
}

export type Message =
	| StartMessage
	| AddFrameMessage
	| SaveMessage
	| AbortMessage;
