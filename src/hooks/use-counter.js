import React, {
    useState, useMemo, useContext, useEffect
} from 'react';
import {
    StyleSheet, View, Text, TouchableOpacity, Image, Dimensions, ScrollView,
} from 'react-native';

export default function useCounter({ to, style = {} }) {
    const [start, setStart] = useState(to);
    const [count, setCount] = useState(to);

    useEffect(() => {
        setCount(to);
        if (count !== to) {
            setStart(to);
        }
    }, [to]);

    return <Text {...{style}} >{count}</Text>
}
