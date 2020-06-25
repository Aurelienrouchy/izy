import React, {
    useContext, useState, useEffect
} from 'react';
import {
    StyleSheet, View, Animated, Text, TouchableOpacity, Image, Dimensions, ScrollView,
} from 'react-native';
import { SharedElement } from 'react-navigation-shared-element';

import { ecpm } from '../constants'


export default function Raffle({ raffle, navigation }) {
    const { 
        cost,
        price,
        usersCount,
        image,
        primaryBg,
        secondaryBg,
        translateY
    } = raffle;
    const opacity = translateY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0],
    });
    const pct = usersCount * 100 / (price / (ecpm / 1000));

    const onClick = () => navigation.push('ParticipateModal', { raffle });

    return (
        <Animated.View
            style={[styles.main, { opacity, transform: [{ translateY }]}]}
        >
            <TouchableOpacity style={styles.touch} onPress={ () => onClick(price) } >
                <SharedElement id={`item.${raffle.id}.photo`}>
                    <Image resizeMode="cover" style={styles.image} source={image} />
                </SharedElement>
                <View style={styles.infosContainer}>
                    <View style={styles.infos}>
                        {/* <View style={{...styles.costAndNombreContainer}}> */}
                            <View style={{...styles.costContainer}}>
                                <Text style={styles.cost}>{cost}</Text> 
                                <Image style={styles.costImage} source={require('../../assets/images/coin.png')} />                     
                            </View>                       
                        {/* </View> */}
                        <Text style={styles.price}>{price} €</Text>
                        <View style={{...styles.pctContainer, backgroundColor: primaryBg}}>
                            <View style={{...styles.pct, width: `${pct}%`, backgroundColor: secondaryBg}}></View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    main: {
        height: 128,
        width: '100%',
        flexDirection: 'row',
        marginBottom: 12,
        borderRadius: 20,
        overflow: 'hidden',
    },
    touch: {
        width: '100%',
        height: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
        borderWidth: 2,
        borderRadius: 20,
        borderColor: '#fff',
    },
    infosContainer: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        padding: 6,
    },
    infos: {
        height: '100%',
        width: 120,
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 17,
        padding: 10
    },
    price: {
        fontFamily: 'MontserratM',
        fontSize: 36
    },
    nombre: {
        fontFamily: 'MontserratM',
        fontSize: 18
    },
    pctContainer: {
        width: '100%',
        height: 10,
        borderRadius: 4,
        overflow: 'hidden'
    },
    pct: {
        ...StyleSheet.absoluteFillObject,
        height: 10
    },
    costAndNombreContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between'
    },
    costContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    costImage: {
        width: 20,
        height: 20
    }
});
