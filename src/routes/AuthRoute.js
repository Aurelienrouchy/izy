import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import SignIn from './../views/SignIn';

const AuthRoutes = createStackNavigator(
    {
        SignIn
    },
    {
      initialRouteName: 'SignIn',
      defaultNavigationOptions: {
            headerShown: false,
        }
    }
);

export default AuthRoutes;