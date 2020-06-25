/* eslint-disable max-len */
import React, { useEffect, useState, useContext } from 'react';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import * as Google from 'expo-google-app-auth';
import * as SecureStore from 'expo-secure-store';
import { useApolloClient } from '@apollo/react-hooks';
import { useNavigation } from 'react-navigation-hooks'

import { AUTH, GET_USER_WITH_TOKEN } from '../graphql/queries';
import { Context } from '../hooks/use-context';

const useAuth = function() {
    const navigation = useNavigation();
    const client = useApolloClient();
    const { dispatch, state } = useContext(Context);
    
    const signInWithProvider = async (provider) => {
        try {
            let token;
            let type;
            switch (provider) {
                case 'google':
                    const { type: googleType, accessToken: googleToken } = await Google.logInAsync({
                        iosClientId: '108595256943-qq5i3mc7cn5u10ghoflb9hp9n3os10oc.apps.googleusercontent.com',
                        androidClientId: '108595256943-r6ogjvtbmqonlrbaonjcichnvpka43jo.apps.googleusercontent.com',
                        scopes: ['profile', 'email'],
                    });

                    token = googleToken;
                    type = googleType;
                    break;
                case 'facebook':
                    const result = await LoginManager.logInWithPermissions(['public_profile']);
                    if (result.isCancelled) {
                        return
                    } else {
                        const { accessToken: facebookToken } = await AccessToken.getCurrentAccessToken();
                        token = facebookToken;
                        type = 'success';
                    }
                    break;
                default:
                    break;
            }
            if (type === 'success') {
                console.log(token)
                const { data: { auth: user } } = await client.mutate({ mutation: AUTH, variables: { token, provider } });

                await SecureStore.setItemAsync('token', user.token);
                await SecureStore.setItemAsync('provider', 'facebook');

                dispatch({type: 'SIGN_IN', user, isLogin: true});
                navigation.navigate('Home');
            } else {
                // type === 'cancel'
            }
        } catch (e) {
            throw Error(e);
        }
    }; 

    const signOut = async () => {
        try {
            dispatch({type: 'SIGN_OUT'});
            await SecureStore.deleteItemAsync('token');
            navigation.navigate('Auth');
        } catch (err) {
            throw Error(err);
        }
	};
	
	const getUser = async () => {
		try {
            const token = await SecureStore.getItemAsync('token');

			if (!token) {
				return null;
			}
			const { data: { getUserWithToken: user } } = await client.query({ query: GET_USER_WITH_TOKEN, variables: { token } });

			if (!user) {
				return null;
			}

			dispatch({type: 'SIGN_IN', user, token});

			return user;
		} catch (err) {
			throw Error(err);
		}
	};

	return {
		signInWithProvider,
		getUser,
		signOut,
	}
};

export default useAuth;