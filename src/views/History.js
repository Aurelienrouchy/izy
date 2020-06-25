import React, { useEffect, useState } from 'react';
import {
    StyleSheet, Image, TouchableOpacity, Text, ScrollView, Dimensions, View,
} from 'react-native';
import { useQuery } from '@apollo/react-hooks';

import { GET_HISTORY } from '../graphql/queries.js'

const { width, height } = Dimensions.get('screen');

export default function History({ navigation }) {
    const [histories, getHistories] = useState([]);
    const { loading, error, data } = useQuery(GET_HISTORY);

    useEffect(() => {
        if (data) {
            getHistories(data.getHistory);
        }
    }, [data]);

    const getDate = (timestamp) => {
        const date = new Date(timestamp);
        return [date.getDay(), date.getMonth(), date.getFullYear()]
    };
    
    return (
        <View style={{ ...styles.main }}>
            <View style={{ ...styles.header }}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.prev} onPress={() => navigation.goBack()}>
                        <Image style={styles.prev_image} source={require('../../assets/images/prev.png')} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>History</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
                {
                    histories.map(({createAt, user, price}, key) => {
                        const [day, month, year] = getDate(createAt);
                        return (
                            <View style={styles.history} key={key}>
                                <View style={styles.price}>
                                    <Text style={styles.priceText}>{price}</Text>
                                </View>
                                <View style={styles.dateContainer}>
                                    <Text style={styles.date}>{day} /</Text>
                                    <Text style={styles.date}> {month} </Text>
                                    <Text style={styles.date}>/ {year}</Text>
                                </View>
                                <Image style={styles.image} source={{ uri: user }} />
                            </View>
                        )
                    })
                }
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: height / 20,
    },
    history: {
        width: '100%',
        height: 70,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 15,
        paddingHorizontal: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    image: {
        width: 66,
        height: 66,
        borderRadius: 13
    },
    prev: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    prev_image: {
        width: '40%',
        height: '40%',
    },
    headerCoin: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'row',
    },
    titleContainer: {
        marginTop: 30,
        height: 30,
        marginBottom: 20
    },
    title: {
        fontFamily: 'MontserratSM',
        fontSize: 24,
        color: '#000'
    },
    dateContainer: {
        flexDirection: 'row'
    },
    price: {
        borderWidth: 2,
        borderColor: 'red',
        height: 66,
        width: 66,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center'
    },
    priceText: {
        fontSize: 24,
        fontFamily: 'MontserratM',
    },
    date: {
        fontSize: 18,
        fontFamily: 'MontserratM',
    }
});
