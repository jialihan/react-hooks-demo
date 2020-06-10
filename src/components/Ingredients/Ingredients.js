import React, { useState, useEffect, useCallback, useReducer, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from 'components/Ingredients/IngredientList';
import Search from './Search';
import ErrorModal from 'components/UI/ErrorModal';
import useHttp from 'hooks/http';

const ingredientsReducer = (currentIngredients, action) => {
	switch (action.type) {
		case 'SET':
			return action.ingredients;
		case 'ADD':
			return [ ...currentIngredients, action.ingredients ];
		case 'DELETE':
			return currentIngredients.filter((ing) => ing.id !== action.id);
		default:
			throw new Error('should not get here');
	}
};

const Ingredients = () => {
	const [ ingredients, dispatch ] = useReducer(ingredientsReducer, []);
	// const [ ingredients, setIngredients ] = useState([]);
	// const [ isLoading, setIsLoading ] = useState(false);
	// const [ error, setError ] = useState(null);
	const { isLoading, error, data, sendRequest, reqExtra, reqIdentifier, clearHttpState } = useHttp();

	// after delete: update data for our own hook
	useEffect(
		() => {
			if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
				dispatch({ type: 'DELETE', id: reqExtra });
			} else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
				dispatch({ type: 'ADD', ingredients: { id: data.name, ...reqExtra } });
			}
		},
		[ data, reqExtra, reqIdentifier, isLoading ]
	);

	const filterdIngredientsHandler = useCallback((filteredIngredients) => {
		// setIngredients(filteredIngredients);
		dispatch({ type: 'SET', ingredients: filteredIngredients });
	}, []);

	// useEffect(() => {
	// 	// no param: after and every render cycle
	// 	// fetch data
	// 	fetch('https://react-hooks-5802c.firebaseio.com/ingredients.json')
	// 		.then((resp) => resp.json())
	// 		.then((responseData) => {
	// 			// transform data
	// 			const loadedIngredients = [];
	// 			for (let key in responseData) {
	// 				loadedIngredients.push({
	// 					id: key,
	// 					title: responseData[key].title,
	// 					amount: responseData[key].amount
	// 				});
	// 			}
	// 			setIngredients(loadedIngredients);
	// 		});
	// }, []);

	// useEffect(
	// 	() => {
	// 		console.log('render ingredients:', ingredients);
	// 	},
	// 	[ ingredients ]
	// );

	const addIngredientHanlder = useCallback(
		(ing) => {
			sendRequest(
				'https://react-hooks-5802c.firebaseio.com/ingredients.json',
				'POST',
				JSON.stringify(ing),
				ing,
				'ADD_INGREDIENT'
			);
			// dispatchHTTP({ type: 'SEND' });
			// // setIsLoading(true);
			// // browser api default, will return a promise
			// fetch('https://react-hooks-5802c.firebaseio.com/ingredients.json', {
			// 	method: 'POST',
			// 	body: JSON.stringify(ing),
			// 	headers: {
			// 		'Content-Type': 'application/json'
			// 	}
			// })
			// 	.then((response) => {
			// 		dispatchHTTP({ type: 'RESP' });
			// 		// setIsLoading(false);
			// 		return response.json();
			// 	})
			// 	.then((responseData) => {
			// 		//  Math.random().toString(), use key from firebase
			// 		// setIngredients((prevIngredients) => [ ...prevIngredients, { id: responseData.name, ...ing } ]);
			// 		dispatch({ type: 'ADD', ingredients: { id: responseData.name, ...ing } });
			// 	})
			// 	.catch((err) => {
			// 		dispatchHTTP({ type: 'ERROR', errorData: err.message });
			// 		// setError('something went wrong');
			// 	});
		},
		[ sendRequest ]
	);

	const removeIngredientHanlder = useCallback(
		(id) => {
			sendRequest(
				`https://react-hooks-5802c.firebaseio.com/ingredients/${id}.json`,
				'DELETE',
				null,
				id,
				'REMOVE_INGREDIENT'
			);
			// dispatchHTTP({ type: 'SEND' });
			//setIsLoading(true);
			// fetch(`https://react-hooks-5802c.firebaseio.com/ingredients/${id}.json`, {
			// 	method: 'DELETE'
			// })
			// 	.then((response) => {
			// 		// setIsLoading(false);
			// 		dispatchHTTP({ type: 'RESP' });
			// 		// const newIngredients = ingredients.filter((el) => {
			// 		// 	return el.id !== id;
			// 		// });
			// 		// setIngredients(newIngredients);
			// 		dispatch({ type: 'DELETE', id: id });
			// 	})
			// 	.catch((err) => {
			// 		dispatchHTTP({ type: 'ERROR', errorData: err.message });
			// 		// setError('something went wrong');
			// 	});
		},
		[ sendRequest ]
	);

	const ingredientList = useMemo(
		() => {
			return <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHanlder} />;
		},
		[ ingredients, removeIngredientHanlder ]
	);

	return (
		<div className="App">
			{error && <ErrorModal onClose={clearHttpState}>{error}</ErrorModal>}
			<IngredientForm onAddIngredient={addIngredientHanlder} loading={isLoading} />

			<section>
				<Search onLoadingIngredients={filterdIngredientsHandler} />
				{/* Need to add list here! */}
				{/* <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHanlder} /> */}
				{ingredientList}
			</section>
		</div>
	);
};

export default Ingredients;
