/* action types */

export const ADD_LOGLINE = 'ADD_LOGLINE';
export const CLEAR_LOG = 'CLEAR_LOG';

/* action creators */

export function addLogline(message) {
	return {
		type: ADD_LOGLINE,
		message
	};
}

export function clearLog() {
	return {
		type: CLEAR_LOG
	};
}