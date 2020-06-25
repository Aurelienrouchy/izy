import React, { useReducer, useEffect } from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { AdMobRewarded } from 'expo-ads-admob'

import graphQLClient from './src/graphql';
import { reducer, initialState } from './src/reducer';
import { rewardReducer, rewardState } from './src/reducer/rewardReducer';
import AuthLoading from './src/routes';

import Provider from './src/hooks/use-context';
import RewardContext from './src/hooks/use-reward';

const client = graphQLClient();

export default function App() {
	const [state, dispatch] = useReducer(reducer, initialState);
	const [rewardSt, rewardDispatch] = useReducer(rewardReducer, rewardState);

	return (
		<ApolloProvider {...{client}}>
			<Provider {...{state, dispatch}}>
				<RewardContext {...{rewardDispatch, rewardSt}}>
					<AuthLoading />
				</RewardContext>
			</Provider>
        </ApolloProvider>
	);
}
