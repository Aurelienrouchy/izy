import React, { useContext, useState, useEffect } from 'react';
import {
    StyleSheet, TouchableOpacity, Text, Animated, Dimensions, View, Image,
} from 'react-native';
import Modal from 'react-native-modal';

const { width, height } = Dimensions.get('screen');

export default function Drawer({ visible, setOpenGrid }) {
    // const { state: { user }, auth } = useContext(AuthContext);
    const [selected, setSelected] = useState([]);
    const [boules, setBoules] = useState([]);

    const onPress = () => setSelected([]);
    const onSelect = (id) => {
        if (selected.length < 5 || selected.includes(id + 1)) {
            setSelected([...selected, id + 1]);
        }
    };

    const reset = () => {
        const generatedBoules = Array(20).fill(0).map((n, i) => ({ id: i + 1, selected: false }));
        setBoules(generatedBoules);
    };

    useEffect(() => {
        const bls = boules.map((b, i) => ({
            id: i + 1,
            selected: selected.includes(i) ? !b.selected : b.selected,
        }));
        setBoules(bls);
    }, [boules, selected]);

    useEffect(() => {
        reset();
    }, []);

    return (
        <Modal
            animationType="slide"
            transparent
            isVisible={visible}
            backdropOpacity={0.3}
            backdropColor="#000"
            swipeDirection={['up', 'down']}
            onBackdropPress={() => setOpenGrid(false)}
            onBackButtonPress={() => setOpenGrid(false)}
            onSwipeComplete={() => setOpenGrid(false)}
        >
            <View style={styles.main}>
                <View style={styles.boules}>
                    {
                        boules.map((boule, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[styles.boule, { backgroundColor: boule.selected ? '#DD7373' : '#fff' }]}
                                onPress={() => onSelect(boule.id - 1)}
                            >
                                <Text style={styles.text_boule}>{boule.id}</Text>
                            </TouchableOpacity>
                        ))
                    }
                    <View style={styles.buttons}>
                        <TouchableOpacity style={styles.button}>
                            <Image style={styles.image} source={require('../../assets/images/change.png')} />
                            <Text style={styles.text_button}>Random</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}>
                            <Image style={styles.image} source={require('../../assets/images/bin.png')} />
                            <Text style={styles.text_button}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.button_validate} onPress={onPress}>
                        <Text style={styles.text_button}>Validate</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    main: {
        height: 440,
        width: '100%',
        borderRadius: 30,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    boules: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
        justifyContent: 'center',
    },
    boule: {
        height: width / 9,
        width: width / 9,
        borderRadius: 100,
        borderColor: '#DD7373',
        borderWidth: 2,
        marginHorizontal: 10,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttons: {
        width: width - 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    image: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    button: {
        marginTop: 20,
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 20,
        borderWidth: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button_validate: {
        width: width - 60,
        marginTop: 20,
        height: 50,
        borderRadius: 10,
        backgroundColor: '#E3A872',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text_button: {
        fontSize: 18,
    },
    text_boule: {
        fontSize: 18,
    },
});
