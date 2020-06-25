import React, {
    useContext, useState, useEffect, useMemo,
} from 'react';
import {
    StyleSheet, View, Animated, Text, TouchableOpacity, Image, Dimensions, ScrollView,
} from 'react-native';

import { useRewardContext } from '../hooks/use-reward';
import { Context } from '../hooks/use-context';

const { width, height } = Dimensions.get('screen');

export default function AddCoins({ toggleModal }) {
    const { state: { isAdsLoading }, dispatch } = useRewardContext();
    const { state: { user } } = useContext(Context);

    const openModal = () => dispatch({ type: 'TOGGLE_ADS', isVisible: true });

    return (
        <Animated.View style={styles.main} >
            <TouchableOpacity onPress={ () =>  openModal()} >
                <View style={styles.content}>
                    {
                        isAdsLoading ?(
                            <Image
                                source={require('../../assets/images/loaderplus.gif')}
                                style={styles.loader}
                            />
                        ) : (
                            <Text style={styles.add}>+</Text>
                        )
                    }
                    <View style={styles.coinsContainer}>
                        <Text style={styles.coins}>{user.coins || 0}</Text>
                        <Image
                            source={require('../../assets/images/coin.png')}
                            style={styles.coinsPicto}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    main: {
        height: 120,
        backgroundColor: '#262B4E',
        bottom: 0,
        left: 0,
        right: 0,
    },
    content: {
        width: '100%',
        height: 60,
        borderRadius: 10,
        backgroundColor: '#fff',
        marginTop: 30,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    coinsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    coinsPicto: {
        width: 30,
        height: 30
    },
    loader: {
        width: 60,
        height: 60
    },
    add: {
        fontSize: 34
    },
    coins: {
        fontSize: 24,
        fontFamily: 'MontserratSM'
    }
});
