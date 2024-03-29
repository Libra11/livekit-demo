import { LivekitError } from 'livekit-client'

export enum CryptorErrorReason {
	InvalidKey = 0,
	MissingKey = 1,
	InternalError = 2,
}

export class CryptorError extends LivekitError {
	reason: CryptorErrorReason

	constructor(message?: string, reason: CryptorErrorReason = CryptorErrorReason.InternalError) {
		super(40, message)
		this.reason = reason
	}
}

export type CryptorCallbacks = {
	cryptorError: (error: CryptorError) => void
}
