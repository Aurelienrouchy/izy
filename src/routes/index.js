import React, { useLayoutEffect, useState, useContext } from 'react';
import { Image, View } from 'react-native';
import { Asset } from 'react-native-unimodules';
import * as Font from 'expo-font';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import useAuth from '../hooks/use-auth';
import { Context } from '../hooks/use-context';
import { useRewardContext } from '../hooks/use-reward';
import Auth from './AuthRoute';
import Home from './HomeRoutes';

function AuthLoading({navigation}) {
    const [isSplashReady, setIsSplashReady] = useState(false);
    const { getUser } = useAuth();
	
	const { dispatch, state, getRaffles } = useContext(Context);

	// const cacheSplashResourcesAsync = async () => {
	// 	const gif = require('../../assets/images/loader.gif');
		
	// 	return Asset.fromModule(gif).downloadAsync();
	// };
	
	const init = async () => {
		await Font.loadAsync({
			// Load a font `Montserrat` from a static resource
			MontserratM: require('../../assets/fonts/Montserrat-Medium.ttf'),
			MontserratR: require('../../assets/fonts/Montserrat-Regular.ttf'),
			MontserratSM: require('../../assets/fonts/Montserrat-SemiBold.ttf'),
		});
		const user = await getUser();

		if (user) {
			await getRaffles();
			dispatch({type: 'SIGN_IN', user, isLogin: !!user});
		}
		// SplashScreen.hide();
		navigation.navigate(user ? 'Home' : 'Auth');
    };
    
    useLayoutEffect(() => {
		init();
        return dispatch('SIGN_OUT');
    }, []);
	

	const { addRewardListeners, removeRewardListener } = useRewardContext();

    useLayoutEffect(() => {
		addRewardListeners();
        return removeRewardListener;
    }, []);

	// if (!isSplashReady) {
	// 	return (
	// 		<AppLoading
	// 			startAsync={cacheSplashResourcesAsync}
	// 			onFinish={() => setIsSplashReady(true) }
	// 			onError={console.warn}
	// 			autoHideSplash={false}
	// 		/>
	// 	);
	// }

	return (
		<View style={{ flex: 1 }}>
			<Image
				source={require('../../assets/images/loader.gif')}
				onLoad={init}
			/>
		</View>
    )
};

const AppContainer = createAppContainer(
	createSwitchNavigator(
		{
			AuthLoading,
			Auth,
			Home
		},
		{
			initialRouteName: 'AuthLoading',
		}
	)
);

export default AppContainer;

