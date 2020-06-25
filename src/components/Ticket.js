import React, { useContext, useMemo, useEffect } from 'react';
import {
    StyleSheet, Image, TouchableOpacity, Text, Dimensions, View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {
    SharedElement
} from 'react-navigation-shared-element';

const { width, height } = Dimensions.get('screen');
const raffleWidth = width / 1.8;

const Ticket = ({
    navigation,
    style: styleProps,
    card: {
        price,
        image,
        title,
        pct,
        piece
    },
    card
}) => {
    const onClick = () => navigation.push('Play', { card });

    return (
        <Animated.View
            style={{
                ...styles.main,
                ...styleProps,
            }}
        >
            <TouchableOpacity 
                style={styles.touch}
                onPress={ () => onClick() }
            >
                <SharedElement id={`item.${card.id}.photo`}>
                    <Image style={styles.image} source={{uri: image}} />
                </SharedElement>
                <View style={styles.infos}>
                    <Text style={styles.title}>{title}</Text>
                    {/* <View style={styles.pctPiece}>
                        <View style={styles.container}>
                            <Text style={styles.pct}>{pct.toFixed(2)} %</Text>
                        </View>
                        <View style={styles.container}>
                            <Text style={styles.count}>{piece}</Text>
                            <Image style={styles.star} source={require('../../assets/images/star.png')} />
                        </View>
                    </View> */}
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default Ticket;

const styles = StyleSheet.create({
    main: {
        width: raffleWidth,
        height: raffleWidth,
        marginRight: 10,
        borderRadius: 20,
        overflow: 'hidden'
    },
    touch: {
        width: '100%',
        height: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    infos: {
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 7,
        width: raffleWidth - 8,
        height: 70,
        ...StyleSheet.absoluteFillObject,
        left: 4,
        top: raffleWidth - 70 - 4,
        borderRadius: 16,
    },
    pctPiece: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 24,
        color: '#303030',
    },
    pct: {
        fontSize: 12,
        color: '#303030',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    star: {
        width: 20,
        height: 20,
        marginLeft: 10,
    },
    count: {
        fontSize: 14,
        color: '#303030',
    },
});
