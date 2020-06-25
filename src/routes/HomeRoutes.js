import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createStackNavigator } from 'react-navigation-stack';

import Play from '../views/Play';
import ParticipateModal from '../views/ParticipateModal';
import Home from './../views/Home';
import History from './../views/History';

const HomeStack = createSharedElementStackNavigator(
    {
        Home,
        History,
        Play,
        ParticipateModal: {
            screen: ParticipateModal,
            navigationOptions: {
                cardStyle: {
                    backgroundColor: 'transparent',
                }
            }
        },
    }, {
        mode: 'modal',
        defaultNavigationOptions: {
            cardStyleInterpolator: ({ current: { progress }}) => ({ cardStyle: { opacity: progress } }),
            // cardStyle: {
            //     backgroundColor: 'transparent',
            // },
            headerVisible: false,
            headerMode: 'none',
            headerShown: false,
        }
    }
);

export default HomeStack;
