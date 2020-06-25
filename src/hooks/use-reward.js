/* eslint-disable max-len */
import React, {
    useState, useReducer, useContext, createContext, useMemo
} from 'react';
import { useApolloClient, useLazyQuery } from '@apollo/react-hooks';
import { AdMobRewarded } from 'expo-ads-admob'

const RewardContext = createContext();

AdMobRewarded.setAdUnitID('ca-app-pub-3940256099942544/5224354917');

const RewardContextFunctions = ({state, dispatch, client}) => useMemo(
    () => ({
        addRewardListeners: () => {
            AdMobRewarded.addEventListener('rewardedVideoDidLoad', () => {
                dispatch({type: 'TOGGLE_ADS_LOADING', isLoading: false});
                dispatch({type: 'TOGGLE_REWARD', isReward: false});
            });
            AdMobRewarded.addEventListener('rewardedVideoDidFailToLoad', err => {
                dispatch({type: 'TOGGLE_ADS_LOADING', isLoading: true});
                // throw Error('fgsrdht', err);
            });
            AdMobRewarded.addEventListener('rewardedVideoDidClose', () => {
                if(state.isReward) {
                    dispatch({type: 'TOGGLE_TICKET', isVisible: true});
                }
                dispatch({type: 'TOGGLE_ADS_LOADING', isLoading: true});
                dispatch({type: 'TOGGLE_ADS', isVisible: false});
                
                AdMobRewarded.requestAdAsync().catch(error => console.warn(error));
            });
            AdMobRewarded.addEventListener('rewardedVideoDidRewardUser', () => {
                dispatch({type: 'TOGGLE_ADS_LOADING', isLoading: true});
                dispatch({type: 'TOGGLE_REWARD', isReward: true});
            });
            AdMobRewarded.addEventListener('rewardedVideoDidOpen', () => {
                dispatch({type: 'TOGGLE_ADS', isVisible: true});
                dispatch({type: 'TOGGLE_TICKET', isVisible: true});
            });
        },
        removeRewardListener: () => ([
                'rewardedVideoDidLoad',
                'rewardedVideoDidFailToLoad',
                'rewardedVideoDidClose',
                'rewardedVideoDidRewardUser',
                'rewardedVideoDidOpen'
            ].forEach(event => AdMobRewarded.removeEventListener(event))
        ),
        requestAd: async () => await AdMobRewarded.requestAdAsync().catch(error => console.warn(error)),
        isReady: async () => await AdMobRewarded.getIsReadyAsync()
    }),
    []
)
 
export const useRewardContext = () => useContext(RewardContext);

export default function RewardProvider({ rewardDispatch: dispatch, rewardSt: state, children }) {
    const client = useApolloClient();
    const functions = RewardContextFunctions({dispatch, state, client});

    return <RewardContext.Provider value={{...functions, state, dispatch}}>{children}</RewardContext.Provider>;
}