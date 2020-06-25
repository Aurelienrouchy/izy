import React, { useContext, useState, useEffect, useMemo } from 'react';
import {
    StyleSheet, Image, TouchableOpacity, Text, Animated, Dimensions, View, TouchableWithoutFeedback
} from 'react-native';
import { SharedElement } from 'react-navigation-shared-element';
import { useMutation } from '@apollo/react-hooks';

import { Context } from '../hooks/use-context';
import { PARTICIPATE_RAFFLE } from '../graphql/queries.js';

const { width, height } = Dimensions.get('screen');

export default function ParticipateModal({ navigation }) {
    const [isFirst, setIsFirst] = useState(true);
    const { dispatch, state: { user }} = useContext(Context);
    const { cost, price, image, primaryBg, secondaryBg, id } = navigation.getParam('raffle'); 
    const [ participateRaffle, { loading, error }] = useMutation(PARTICIPATE_RAFFLE);

    const close = () => navigation.goBack();

    const participate = async () => {
        if (user.coins >= cost) {
            const res = await participateRaffle({ variables: { price, coins: cost } });
            dispatch({type: 'UPADATE_COINS', coins: res.data.incrementRaffle.coins});
        }
    };

    const {
        opacity
    } = useMemo(() => {
        const opacity = new Animated.Value(0);
        Animated.timing(
            opacity,
            {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
            delay: 100
            }
        ).start();
        
        return {
            opacity
        }
    }, []);

    return (
        <TouchableWithoutFeedback onPress={close} >
            <View style={styles.main}>
                <View style={styles.modal}>
                    <SharedElement id={`item.${id}.photo`}>
                        <Image style={styles.background} resizeMode="cover" source={image} />
                    </SharedElement>
                    <Animated.View style={[styles.infosContainer, { opacity }]} >
                        <View style={styles.coinContainer}>
                            <Text style={styles.coinText}>Spend {cost}</Text>
                            <Image style={styles.coinImage} source={require('../../assets/images/coin.png')} />
                        </View>
                        {
                            (user.coins < cost) && (
                                <View style={[styles.coinContainer, styles.subCoinContainer]}>
                                    <Text style={styles.subCoinText}>need {(user.coins - cost) * -1}</Text>
                                    <Image style={styles.subCoinImage} source={require('../../assets/images/coin.png')} />
                                </View>
                            )
                        }
                        {
                            loading && <View><Text>Loading...</Text></View>
                        }
                        {
                            error && <View><Text>Error :\</Text></View>
                        }
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity 
                                onPress={participate} 
                                style={{
                                    ...styles.button, 
                                    ...styles.buttonLeft,
                                    borderColor: secondaryBg
                                }}
                                >
                                <Text style={styles.buttonText}>YES</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={close} style={{...styles.button, borderColor: primaryBg}}>
                                <Text style={styles.buttonText}>NO</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};


ParticipateModal.sharedElements = (navigation, otherNavigation, showing) => {
    const raffle = navigation.getParam('raffle');
    return [`item.${raffle.id}.photo`];
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)'
    },
    modal: {
        height: 300,
        width: width - 60,
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
        marginLeft: 10,
    },
    background: {
        height: 300,
        width: width - 60,
        borderWidth: 2,
        borderRadius: 20,
        borderColor: '#fff'
    },
    infosContainer: {
        ...StyleSheet.absoluteFillObject,
        top: 142,
        left: 8,
        borderRadius: 16,
        backgroundColor: '#fff',
        height: '50%',
        width: width - 76,
        justifyContent: 'space-between'
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginBottom: 8
    },
    button: {
        height: 60,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 4
    },
    buttonText: {
        fontFamily: 'MontserratSM',
        fontSize: 24,
    },
    coinContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 8
    },
    subCoinContainer: {
        marginBottom: 14
    },
    coinImage: {
        width: 30,
        height: 30
    },
    subCoinImage: {
        width: 20,
        height: 20
    },
    coinText: {
        fontSize: 24,
        marginBottom: 1
    },
    subCoinText: {
        fontSize: 18,
    }
});
