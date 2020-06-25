import React, {
    useState, useMemo, useContext,
} from 'react';
import {
    StyleSheet, View, Text, TouchableOpacity, Image, Dimensions, ScrollView,
} from 'react-native';
import Animated, {
    event,
    sub,
    multiply,
    divide,
    interpolate,
    add,
    cond,
    eq,
    floor,
} from 'react-native-reanimated';

import Ticket from '../components/Ticket';

import { Context } from '../hooks/use-context';
import { tickets } from '../constants';

const { width, height } = Dimensions.get('screen');
const raffleWidth = width / 1.8;
const raffleWidthMargin = raffleWidth;

export default function Tickets({ navigation }) {
    const { dispatch, state } = useContext(Context);

    const openMoreRaffles = () => dispatch({ type: 'TOGGLE_MORE_RAFFLES' });

    const { 
        onScroll,
        renderTickets
    } = useMemo(() => {
        const x = new Animated.Value(0);
        const onScroll = event([{ nativeEvent: { contentOffset: { x } } }], { useNativeDriver: true });
       
        const current = divide(x, raffleWidth);
        const pct = [
            multiply(sub(current, floor(current)), 100),
        ];
        

        const renderTickets = tickets.map((card, index) => {
            const scaleInterpolate = interpolate(pct, {
                inputRange: [0, 100],
                outputRange: [0.8, 1]
            });
            const scale = cond(
                eq(index, floor(current)),
                1,
                cond(
                    eq(index, add(floor(current), 1)),
                    scaleInterpolate,
                    0.8
                )
            );

            return ( 
                <Ticket
                    key={index}
                    style={{
                        transform: [ { scale } ]
                    }}
                    card={card}
                    navigation={navigation}
                />
            )
        })

        return {
            onScroll,
            renderTickets
        }
    }, []);
    


    return (
        <View style={styles.main}>
            <View style={styles.header}>
                <Text style={styles.title}>Tickets</Text>
            </View>
            <View style={styles.raffles}>
                <Animated.ScrollView
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={raffleWidth + 10}
                    decelerationRate="fast"
                    scrollEventThrottle={16}
                    horizontal
                    onScroll={onScroll}
                >
                    {
                        renderTickets
                    }
                </Animated.ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        height: 250,
        marginTop: 30,
        width: width - 30
    },
    header: {
        height: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 20
    },
    title: {
        fontFamily: 'MontserratSM',
        fontSize: 24,
        color: '#000'
    },
    more: {
        fontFamily: 'MontserratM',
        fontSize: 14,
        paddingBottom: 3,
        color: '#000'
    },
});
