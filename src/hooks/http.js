import { useReducer, useCallback } from 'react';

const initialState = {
	loading: false,
	error: null,
	data: null,
	extra: null,
	identifier: null
};

const httpReducer = (curHttpState, action) => {
	switch (action.type) {
		case 'SEND':
			console.log('isloading:', curHttpState.loading);
			return {
				loading: true,
				error: null,
				data: null,
				extra: null,
				identifier: action.identifier
			};
		case 'RESPONSE':
			console.log('isloading:', curHttpState.loading);
			return { ...curHttpState, loading: false, data: action.responseData, extra: action.extra };
		case 'ERROR':
			return { error: action.errorMessage, loading: false };
		case 'CLEAR':
			return initialState;
		default:
			throw new Error('should not get here');
	}
};
// const initalState = {
// 	loading: false,
// 	error: null,
// 	data: null,
// 	extra: null,
// 	identifier: null
// };
const useHttp = () => {
	const [ httpState, dispatchHTTP ] = useReducer(httpReducer, initialState);
	// statefulness

	const sendRequest = useCallback((url, method, body, reqExtra, reqIdentifer) => {
		dispatchHTTP({ type: 'SEND', identifier: reqIdentifer });
		fetch(url, {
			method: method,
			body: body,
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((resp) => resp.json())
			.then((resp) => {
				// setIsLoading(false);
				dispatchHTTP({
					type: 'RESPONSE',
					responseData: resp,
					extra: reqExtra
				});
				// const newIngredients = ingredients.filter((el) => {
				// 	return el.id !== id;
				// });
				// setIngredients(newIngredients);
				// dispatch({ type: 'DELETE', id: id });
			})
			.catch((err) => {
				dispatchHTTP({ type: 'ERROR', errorMessage: 'something went wrong !' });
				// setError('something went wrong');
			});
	}, []);
	const clear = useCallback(() => {
		// setError(null);
		// setIsLoading(false);
		dispatchHTTP({ type: 'CLEAR' });
	}, []);
	return {
		isLoading: httpState.loading,
		data: httpState.data,
		error: httpState.error,
		sendRequest: sendRequest,
		reqExtra: httpState.extra, // get the id selected
		reqIdentifier: httpState.identifier,
		clearHttpState: clear
	};

	// const httpReducer = (curHttpState, action) => {
	// 	switch (action.type) {
	// 		case 'SEND':
	// 			return {
	// 				loading: true,
	// 				error: null,
	// 				data: null,
	// 				extra: null,
	// 				identifier: action.identifier
	// 			};
	// 		case 'RESPONSE':
	// 			return {
	// 				...curHttpState,
	// 				loading: false,
	// 				data: action.responseData,
	// 				extra: action.extra
	// 			};
	// 		case 'ERROR':
	// 			return { loading: false, error: action.errorMessage };
	// 		case 'CLEAR':
	// 			return initialState;
	// 		default:
	// 			throw new Error('Should not be reached!');
	// 	}
	// };

	// const useHttp = () => {
	// 	const [ httpState, dispatchHttp ] = useReducer(httpReducer, initialState);

	// 	// const clear = useCallback(() => dispatchHttp({ type: 'CLEAR' }), []);
	// 	const clear = useCallback(() => {
	// 		// setError(null);
	// 		// setIsLoading(false);
	// 		dispatchHttp({ type: 'CLEAR' });
	// 	}, []);

	// 	const sendRequest = useCallback((url, method, body, reqExtra, reqIdentifer) => {
	// 		dispatchHttp({ type: 'SEND', identifier: reqIdentifer });
	// 		fetch(url, {
	// 			method: method,
	// 			body: body,
	// 			headers: {
	// 				'Content-Type': 'application/json'
	// 			}
	// 		})
	// 			.then((response) => {
	// 				return response.json();
	// 			})
	// 			.then((responseData) => {
	// 				dispatchHttp({
	// 					type: 'RESPONSE',
	// 					responseData: responseData,
	// 					extra: reqExtra
	// 				});
	// 			})
	// 			.catch((error) => {
	// 				dispatchHttp({
	// 					type: 'ERROR',
	// 					errorMessage: 'Something went wrong!'
	// 				});
	// 			});
	// 	}, []);
};
export default useHttp;
