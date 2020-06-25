import React, {
    useState, useContext, useMemo, useEffect
} from 'react';
import {
    StyleSheet, View, Dimensions, ScrollView, Animated
} from 'react-native';
import { State, PanGestureHandler } from 'react-native-gesture-handler';

import Tickets from '../components/Tickets'
import Raffles from '../components/Raffles';
import Header from '../components/Header';
import { Context } from '../hooks/use-context'
import Drawer from './Drawer';

const {
    timing,
    parallel,
    Value,
    event
} = Animated;

const { width } = Dimensions.get('screen');

export default function Home({ navigation }) {
    const { state, dispatch } = useContext(Context);
    const [translateX, setTranslateX] = useState(new Value(0));
    const [translateY, setTranslateY] = useState(new Value(0));
    const [scale, setScale] = useState(new Value(1));
    const [borderRadius, setBorderRadius] = useState(new Value(0));

    const handleStateChange = ({ nativeEvent }) => {
        if (state.drawerIsOpen) {
            if (nativeEvent.state === State.END && nativeEvent.translationX < -(width / 3)) {
                dispatch({type: 'TOGGLE_DRAWER'});
            }
        }
    };

    useEffect(() => {
        parallel([
            timing(translateX, {
                toValue: state.drawerIsOpen ? width - width / 2.5 : 0,
                duration: 300
            }),
            timing(translateY, {
                toValue: state.drawerIsOpen ? 30 : 0,
                duration: 300
            }),
            timing(scale, {
                toValue: state.drawerIsOpen ? 0.7 : 1,
                duration: 300
            }),
            timing(borderRadius, {
                toValue: state.drawerIsOpen ? 40 : 0,
                duration: 300
            })
        ]).start(() => {
            setTranslateX(new Value(state.drawerIsOpen ? width - width / 2.5 : 0));
            setTranslateY(new Value(state.drawerIsOpen ? 30 : 0));
            setScale(new Value(state.drawerIsOpen ? 0.7 : 1));
            setBorderRadius(new Value(state.drawerIsOpen ? 40 : 0));
        })
        
    }, [state.drawerIsOpen])

    return (
        <PanGestureHandler 
            onHandlerStateChange={handleStateChange}
        >
            <Animated.View style={styles.flex}>
                <Drawer style={styles.flex} navigation={navigation} />
                <Animated.View style={[styles.home, {borderRadius, transform: [{translateX}, {translateY}, {scale}]}]}>
                    <Header {...{navigation}} />
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {
                            state.drawerIsOpen && <View style={styles.cache}></View>
                        }
                        <View style={styles.flex}>
                            <Tickets {...{navigation}} />
                            <Raffles {...{navigation}} />
                        </View>
                    </ScrollView>
                </Animated.View>
            </Animated.View>
        </PanGestureHandler>
    );
};

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    cache: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
        zIndex: 30,
        backgroundColor: 'transparent'
    },
    home: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#fff',
        paddingLeft: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: -2,
            height: 0
        },
        shadowOpacity: 0.50,
        shadowRadius: 15,
        elevation: 19,
    },
    main_cards: {
        height: 300,
        marginVertical: 40,
    },
    main_card: {
        height: '100%',
        width: 250,
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginRight: 20,
    },
    secondary_cards: {
        flex: 1,
        paddingBottom: 30,
    },
    button: {
        paddingVertical: 20,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        textAlign: 'right',
    },
    menu: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    menu_image: {
        width: '40%',
        height: '40%',
    },
    header: {
        flexDirection: 'row',
    },
    header_title: {
        flex: 1,
        alignItems: 'flex-end',
        paddingTop: 15,
    },
});
