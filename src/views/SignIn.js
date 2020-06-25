import React, { useReducer, useContext } from 'react';
import {
    StyleSheet, View, TouchableOpacity, Text,
} from 'react-native';
import useAuth from '../hooks/use-auth';

export default function SignIn({ navigation }) {
    const { signInWithProvider } = useAuth();

    return (
        <View style={styles.main}>
            <TouchableOpacity style={styles.button} onPress={() => signInWithProvider('facebook')}>
                <Text style={styles.text}>Connect with Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => signInWithProvider('google')}>
                <Text style={styles.text}>Connect with Google</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 100,
        backgroundColor: '#262B4E',
        paddingHorizontal: 30,
    },
    button: {
        height: 60,
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#DD7373',
    },
    text: {
        fontSize: 18,
        color: '#fff',
    },
});
