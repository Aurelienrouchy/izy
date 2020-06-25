import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function Loading() {
    return (
        <View style={styles.main}></View>
    );
}

const styles = StyleSheet.create({
    main: {
        backgroundColor: 'red',
        flex: 1,
    },
});
