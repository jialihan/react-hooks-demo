import React, { useEffect, useState, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';
import useHttp from 'hooks/http';
import ErrorModal from 'components/UI/ErrorModal';

const Search = React.memo((props) => {
	const [ filter, setFiler ] = useState('');
	const { onLoadingIngredients } = props;
	const inputRef = useRef();

	// use our own hooks to send http request
	const { isLoading, error, data, sendRequest, clearHttpState } = useHttp();

	useEffect(
		() => {
			console.log('fetch.....ingredinets');
			const timer = setTimeout(() => {
				if (filter === inputRef.current.value) {
					const query = filter.length === 0 ? '' : `?orderBy="title"&equalTo="${filter}"`;
					sendRequest('https://react-hooks-5802c.firebaseio.com/ingredients.json' + query, 'GET');
					// fetch('https://react-hooks-5802c.firebaseio.com/ingredients.json' + query)
					// 	.then((resp) => resp.json())
					// 	.then((responseData) => {
					// 		// transform data
					// 		const loadedIngredients = [];
					// 		for (let key in responseData) {
					// 			loadedIngredients.push({
					// 				id: key,
					// 				title: responseData[key].title,
					// 				amount: responseData[key].amount
					// 			});
					// 		}
					// 		// todo:
					// 		onLoadingIngredients(loadedIngredients);
					// 	});
				}
			}, 500);
			return () => {
				clearTimeout(timer);
			};
		},
		[ filter, inputRef, sendRequest ]
	);
	// useEffect(
	// 	() => {
	// 		if (!isLoading && !error && data) {
	// 			const loadedIngredients = [];
	// 			for (let key in data) {
	// 				loadedIngredients.push({
	// 					id: key,
	// 					title: data[key].title,
	// 					amount: data[key].amount
	// 				});
	// 			}
	// 			onLoadingIngredients(loadedIngredients);
	// 		}
	// 	},
	// 	[ data, isLoading, error, onLoadingIngredients ]
	// );
	useEffect(
		() => {
			if (!isLoading && !error && data) {
				const loadedIngredients = [];
				for (const key in data) {
					loadedIngredients.push({
						id: key,
						title: data[key].title,
						amount: data[key].amount
					});
				}
				onLoadingIngredients(loadedIngredients);
			}
		},
		[ data, isLoading, error, onLoadingIngredients ]
	);
	return (
		<section className="search">
			{error && <ErrorModal onClose={clearHttpState}>{error}</ErrorModal>}
			<Card>
				<div className="search-input">
					<label>Filter by Title</label>
					{isLoading && <span>Loading...</span>}
					<input type="text" value={filter} onChange={(e) => setFiler(e.target.value)} ref={inputRef} />
				</div>
			</Card>
		</section>
	);
});

export default Search;
