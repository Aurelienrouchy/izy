import React, {
    useContext, useState, useEffect, useMemo,
} from 'react';
import {
    StyleSheet, View, Text, TouchableOpacity, Dimensions, Image
} from 'react-native';
import { AdMobRewarded } from 'expo-ads-admob'
import { SharedElement } from 'react-navigation-shared-element';
import { useLazyQuery } from '@apollo/react-hooks';
import { useTimingTransition } from 'react-native-redash';

import { useRewardContext } from '../hooks/use-reward';
import { Context } from '../hooks/use-context';
import { GET_TICKET } from '../graphql/queries'

import Scratch from '../components/Scratch/index.js';
import Animated from 'react-native-reanimated';

const {
    interpolate,
    Value
} = Animated;

const { width, height } = Dimensions.get('screen');

const Play = ({ navigation }) => {
    const [isScratched, setIsScratched] = useState(false);
    const transition = useTimingTransition(isScratched, { duration: 300 });
    const croixContainerWidth =      interpolate(transition, { inputRange: [0, 1], outputRange: [50, 200] });
    const croixContainerTranslateX = interpolate(transition, { inputRange: [0, 1], outputRange: [0, -150] });
    const croixTranslateX =          interpolate(transition, { inputRange: [0, 1], outputRange: [0, 100] });
    const croixOpacity =             interpolate(transition, { inputRange: [0, 1], outputRange: [1, 0] });
    const scratchOpacity =           interpolate(transition, { inputRange: [0, 1], outputRange: [0, 1] });
    const playOpacity =              interpolate(transition, { inputRange: [0, 1], outputRange: [1, 0] });
    const playTranslateY =           interpolate(transition, { inputRange: [0, 1], outputRange: [0, height] });

    const [coins, setCoins] = useState(0);
    const card = navigation.getParam('card');

    const { isReady, requestAd, state: rewardState, dispatch } = useRewardContext();
    useEffect(() => {
        const getIsReady = async () => {
            try {
                const adsIsReady = await AdMobRewarded.getIsReadyAsync();

                if (!adsIsReady) {
                    await requestAd();
                }

            } catch (error) {
                console.log('isreadyError', error)
            }
        }
        getIsReady();

    }, []);

    //
    const [getTicket, { called, loading, data, refetch }] = useLazyQuery(GET_TICKET);
    const { dispatch: dispatchMain, state: MainState } = useContext(Context); 
    useEffect(() => {
        if (!rewardState.isAdsVisible && rewardState.isReward) {
            if (called) refetch();
            else getTicket();
            setIsScratched(true);
        }
    }, [rewardState.isAdsVisible, rewardState.isReward])

    //
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showWinCoinModal = () => {
        setIsModalVisible(true);
        setTimeout(() => setIsModalVisible(false), 3000);
    };

    const show = () => {
        if (!rewardState.isAdsLoading) {
            AdMobRewarded.showAdAsync().catch(error => console.warn(error));
        }
    };

    const close = () => navigation.goBack();

    const afterScratching = (coins) => {
        setIsScratched(false);
        setCoins(coins);
        dispatchMain({type: 'UPADATE_COINS', coins})
        showWinCoinModal();
    };

    return (
        <View style={styles.container}>
            <View style={styles.main}>
                {
                    isScratched && (
                        <Animated.View style={{zIndex: 9, opacity: scratchOpacity}}>
                            <Scratch {...{data, card, afterScratching}} />
                        </Animated.View>
                    )
                }
                <SharedElement id={`item.${card.id}.photo`}>
                    <Image resizeMode="cover" style={styles.image} source={{uri: card.image}} />
                </SharedElement>
                    <Animated.View 
                        style={{
                            ...styles.croixContainer,
                            width: croixContainerWidth,
                            transform: [
                                {translateX: croixContainerTranslateX}
                            ]
                        }}
                    >
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}} >
                            <Animated.Text style={{...styles.textPlay, opacity: scratchOpacity, transform: [{translateX: 20}]}}>Scratch</Animated.Text>
                            <TouchableOpacity onPress={close}>
                                <Animated.View style={{marginRight: 10, opacity: croixOpacity, transform: [{translateX: croixTranslateX}]}}>
                                    <Image style={styles.imageCroix} source={require('../../assets/images/croix.png')} />
                                </Animated.View>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                <Animated.View style={{...styles.buttonPlayContainer, opacity: playOpacity, transform: [{translateY: playTranslateY}]}}>
                    {
                        isModalVisible && (
                            <View style={styles.winCointainer}>
                                <Image style={styles.winImage} source={require('../../assets/images/win.png')} />
                                <Text style={styles.winText}>You Win</Text>
                                <Text style={styles.coinsText}>{coins}</Text>
                            </View>
                        )
                    }
                    
                    <TouchableOpacity style={styles.buttonPlay} onPress={show}>
                        <Text style={styles.textPlay}>Play</Text>
                        {
                            (rewardState.isAdsLoading || loading) && <Image style={styles.loader} source={require('../../assets/images/splash.gif')} />
                        }
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    );
};

Play.sharedElements = (navigation, otherNavigation, showing) => {
    const card = navigation.getParam('card');
    return [`item.${card.id}.photo`];
};

export default Play;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    main: {
        flex: 1,
    },
    image: {
        width,
        height
    },
    croixContainer: {
        ...StyleSheet.absoluteFillObject,
        left: width - 50 - 30,
        zIndex: 10,
        top: 60,
        height: 50,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        overflow: 'hidden'
    },
    imageCroix: {
        width: 30,
        height: 30
    },
    buttonPlayContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 10,
        top: height / 3 * 2,
        width: '100%',
        alignItems: 'center'
    },
    buttonPlay: {
        width: 150,
        height: 60,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
    },
    textPlay: {
        fontSize: 36,
        fontFamily: 'MontserratM'
    },
    loader: {
        width: 60,
        height: 60
    },
    winCointainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 10,
        justifyContent: 'flex-end',
        paddingBottom: 40,
        top: -250,
        left: width / 2 - 125,
        width: 250,
        height: 200,
        backgroundColor: '#fff',
        alignItems: 'center',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
    },
    coinsText: {
        ...StyleSheet.absoluteFillObject,
        top: -80,
        left: 72.5,
        width: 100,
        height: 67,
        fontSize: 40,
        backgroundColor: '#ffca26',
        textAlign: 'center',
        paddingVertical: 5,
    },
    winText: {
        fontSize: 40
    },
    winImage: {
        ...StyleSheet.absoluteFillObject,
        top: -150,
        left: 100 - 104,
        width: 250,
        height: 250,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.58,
        shadowRadius: 6.00,
    }
});
