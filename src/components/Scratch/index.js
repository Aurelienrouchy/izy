import React, {
    useEffect, useRef, useState, useContext, useLayoutEffect
} from 'react';
import {
    StyleSheet, View, Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import AssetUtils from 'expo-asset-utils';
import { FileSystem } from 'react-native-unimodules';


import { GET_TICKET } from '../../graphql/queries'
import { useRewardContext } from '../../hooks/use-reward';

const { width, height } = Dimensions.get('screen');

export default function Scratch({ data, card, afterScratching }) {
    const el = useRef(null);
    const [ready, setReady] = useState(false);
    const [html, setHtml] = useState('');

    useLayoutEffect(() => {
        if (data) {
            let js = `
                setTimeout(function() {
                    const container = document.getElementById('js--sc--container');
                `
                data.getTicket.selected.forEach(({number, value}, index) => {
                    js += `
                        let div${index} = document.createElement('div');
                        div${index}.textContent = "${number} - ${value}";
                        div${index}.style.position = "absolute";
                        div${index}.style.top = "${30 * index}px";
                        div${index}.style.left = "${30 * index}px";
                        div${index}.style.zIndex = 2;
                        document.body.appendChild(div${index});
                    `
                })
                js += `
                }, 200);
            `;

            ready && el.current.injectJavaScript(js);
        }

    }, [ready, data]);

    useLayoutEffect(() => {
        const getHtml = async () => {
            const file = await AssetUtils.resolveAsync(require("./ticket.html"));
            let fileContents = await FileSystem.readAsStringAsync(file.localUri);
            fileContents += `
            window.addEventListener('load', function () {
                window.ReactNativeWebView.postMessage("load")
                var scContainer = document.getElementById('js--sc--container');
                var sc = new ScratchCard('#js--sc--container', {
                    enabledPercentUpdate: true,
                    scratchType: SCRATCH_TYPE.CIRCLE,
                    // brushSrc: './images/brush.png',
                    containerWidth: ${width},
                    containerHeight: ${height},
                    imageForwardSrc: '${card.image}',
                    imageBackgroundSrc: 'https://images.unsplash.com/photo-1531525797753-909788106ccb?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
                    clearZoneRadius: 30,
                    percentToFinish: 20,
                    nPoints: 30,
                    pointSize: 4,
                    callback: function () {
                        window.ReactNativeWebView.postMessage("finish")
                    }
                })
                sc.init();
            })
            </script>

            </body>
            </html>`
            setHtml(fileContents);
        };
        getHtml();
    }, []);

    const onMessage = (event) => {
        switch (event.nativeEvent.data) {
            case 'finish':
                const res = data.getTicket.selected.reduce((acc, cur) => acc + cur.value, 0);
                afterScratching(res);
                break;
            case 'load':
                setReady(true);
                break;
            default:
                break;
        }
    };


    

    
    return (
        <View style={styles.main}>
            {
                data && (
                    <WebView
                        ref={el}
                        style={styles.webview}
                        originWhiteList={['*']}
                        containerStyle={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onMessage={onMessage}
                        source={{html}}
                        allowFileAccessFromFileURLs={true}
                        domStorageEnabled
                        allowFileAccess={true}
                        javaScriptEnabled={true}
                        mixedContentMode="compatibility"
                    />
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        ...StyleSheet.absoluteFillObject,
        height,
        width,
        flex: 1,
        zIndex: 2,
        // backgroundColor: 'blue'
    },
    webview: {
        width,
        height,
    },
});
