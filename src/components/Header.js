import React, { useContext, useState } from 'react';
import {
    StyleSheet, Image, TouchableOpacity, Text, Animated, Dimensions, View,
} from 'react-native';

import { Context } from '../hooks/use-context';
import Counter from '../hooks/use-counter';

const { width, height } = Dimensions.get('screen');

export default function Header({ navigation, ...args }) {
    const { state: { user }, dispatch } = useContext(Context);
    const coins = user.coins || 0;
    
    const toggle = () => dispatch({type: 'TOGGLE_DRAWER'});

    return (
        <View style={{ ...styles.main }}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.menu} onPress={toggle}>
                    <Image style={styles.menu_image} source={require('../../assets/images/menu-dots.png')} />
                </TouchableOpacity>
                <View style={styles.headerCoin}>
                    <Counter style={styles.coins} to={coins} />
                    <Image style={styles.coinsIcon} source={require('../../assets/images/coin.png')} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        backgroundColor: '#fff',
        paddingRight: 30,
        paddingTop: height / 20,
    },
    menu: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    menu_image: {
        width: '40%',
        height: '40%',
    },
    header: {
        flexDirection: 'row',
    },
    headerCoin: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'row',
    },
    coinsIcon: {
        width: 40,
        height: 40
    },
    coins: {
        fontSize: 24,
        fontFamily: 'MontserratM',
        marginRight: 10
    },
});
