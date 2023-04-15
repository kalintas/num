
import { Modal, Pressable, TouchableWithoutFeedback, View, Text, StyleSheet, Image, Animated } from "react-native";

import { BlurView } from "@react-native-community/blur";
import { useEffect, useRef, useState } from "react";

export default function Popup({ visible, title, onClose, onGoBack, startAnimPos, endAnimPos, endAnimCallback, children }) {

    const slideAnim = useRef(new Animated.Value(startAnimPos ? startAnimPos : 0)).current;

    const [isVisible, setIsVisible] = useState(false);
    
    const setAnimPos = (toPos, callback) => {
    
        Animated.timing(slideAnim, {
            toValue: toPos,
            duration: 700,
            useNativeDriver: true,
        }).start(callback);
    }

    const closePopup = () => {
        
        if (onClose) {
            onClose();
        } else if (onGoBack) {
            onGoBack();
        }

        visible = false;
    }

    useEffect(() => {

        if (isVisible == visible) {
            return;
        } 

        if (visible) {

            if (startAnimPos) {
                setAnimPos(0, () => { if (endAnimCallback) { endAnimCallback(); } });
            }
        
        } else {

            if (endAnimPos) {
                setAnimPos(endAnimPos, () => { setIsVisible(visible) });
                return;
            }

        }

        setIsVisible(visible);

    }, [visible]);

    return (
        <Modal
            style={{ flex: 1 }}
            animationType="fade"
            transparent={true}
            visible={isVisible}
    
            onRequestClose={closePopup}>

            <BlurView
                style={styles.screenBlur}
                blurType="light"
                blurAmount={50}
                blurRadius={5}
                reducedTransparencyFallbackColor="white"
                />
            <Pressable 
                style={styles.popup} 
                activeOpacity={1} 
                onPressOut={closePopup}>
                
                <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.popupContent, {opacity: 1}]}>

                            {
                                title && 
                                [<View key="title" style={{flexDirection: "row"}}>

                                    {
                                        onGoBack && 
                                        <Pressable style={styles.backButton} onPressOut={() => { onGoBack(); }}>
                                            <Image style={styles.backButton} source={require("../assets/back.png")}/>
                                        </Pressable>
                                    }
                
                                    <Text style={[styles.popupHeader, { marginRight: onClose ? 0 : "auto", marginLeft: onGoBack ? 0 : "auto" }]}>{ title }</Text>

                                    {
                                        onClose && 
                                        
                                        <Pressable style={styles.cancelButton} onPressOut={() => { onClose(); }}>
                                            <Image style={styles.cancelButton} source={require("../assets/cancel.png")}/>
                                        </Pressable>
                                    }

                                </View>,
                                <View key="hr" style={{ borderBottomColor: "#fcfcfc", opacity: 0.2, borderBottomWidth: 2 }}/>]
                            }

                            { children } 

                        </View>
                        
                    </TouchableWithoutFeedback>
                </Animated.View>

            </Pressable>               


        </Modal>
    );
}

const styles = StyleSheet.create({

    popup: {
        flex: 1,

        alignItems: "center",   
        justifyContent: "center",

        backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    popupContent: {
        
        textAlign: "left",
        
        backgroundColor: "#fcfcfc47",
        borderRadius: 15,
        padding: 30,
        width: 350,
    },
    popupHeader: {

        fontSize: 30,

        letterSpacing: 8,
        fontFamily: "ptf",
        paddingBottom: 20,
        
        color: "#fcfcfc",
    },
    screenBlur: {

        position: "absolute",

        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    cancelButton: {
        
        marginLeft: "auto",
        width: 20,
        height: 20,
    },
    backButton: {
        
        marginRight: "auto",
        width: 20,
        height: 20,
    }
});
