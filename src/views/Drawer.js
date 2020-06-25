/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import {
    StyleSheet, Image, TouchableOpacity, Text, Animated, Dimensions, View,
} from 'react-native';
import { drawerRoutes } from '../constants/index';
import useAuth from '../hooks/use-auth';
import { Context } from '../hooks/use-context';

const { width, height } = Dimensions.get('screen');

export default function Drawer({ navigation }) {
    const { signOut } = useAuth();
    const { state: { user }, dispatch } = useContext(Context);
    const { name, photoURL } = user;

    const navigate = (route) => {
        setTimeout(() => navigation.navigate(route), 300);
        dispatch({type: 'TOGGLE_DRAWER'});
    };

    const logout = () => {
        setTimeout(() => signOut(), 300);
        dispatch({type: 'TOGGLE_DRAWER'});
    };

    return (
        <View style={{ ...styles.main }}>
            <View style={styles.infos}>
                <View style={styles.infos_user}>
                    <Text style={styles.user_name}>{ name }</Text>
                    <Text style={styles.user_money}>0 €</Text>
                </View>
                <Image style={styles.photo} source={{ uri: photoURL }} />
            </View>
            <View style={styles.routes}>
                {
                    drawerRoutes.map((route, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.route}
                            onPress={() => {
                                if (route.name === 'Logout') logout();
                                else navigate(route.name);
                            }}
                        >
                            <Image style={styles.route_icon} source={route.icon} />
                            <Text style={styles.route_name}>{route.name}</Text>
                        </TouchableOpacity>
                    ))
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        backgroundColor: '#fff',
        height: '100%',
        width: '100%',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    routes: {
        flex: 1,
        paddingTop: height / 10,
        paddingLeft: width / 10,
    },
    route: {
        width: '100%',
        height: 40,
        marginTop: 40,
        flexDirection: 'row',
        alignItems: 'center',
    },
    route_name: {
        marginLeft: 20,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#262B4E',
    },
    infos: {
        height: 50,
        marginTop: 40,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexDirection: 'row',
    },
    infos_user: {
        height: 50,
        justifyContent: 'space-evenly',
        alignItems: 'flex-end',
        marginRight: 30,
    },
    user_money: {
        fontSize: 16,
        color: '#4c527e',
    },
    user_name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#262B4E',
    },
    photo: {
        backgroundColor: 'white',
        width: 50,
        height: 50,
        borderRadius: 25,
    },
});
