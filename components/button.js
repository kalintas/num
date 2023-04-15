import { useState } from "react";
import { View } from "react-native";
import { Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import DropShadow from "react-native-drop-shadow";
import { Shadow } from 'react-native-neomorph-shadows';
import { playButtonPress, playButtonRelease } from "../lib/sound";

export function TextButton(params) {

    return (
        <Button {...params}>
            <Text adjustsFontSizeToFit={true} numberOfLines={1} style={[styles.buttonText, params.textStyle]}>{ params.children }</Text>
        </Button>
    );
}

export function ImageButton(params) {

    return (
        <Button {...params}>
            <DropShadow 
                style={{
                    shadowColor: "darkgray",
                    shadowOffset: {
                        width: 1,
                        height: 1,
                    },
                    shadowOpacity: 1,
                    shadowRadius: 3
                }}
            > 
                <Image style={params.imageStyle} source={params.source}/>
            </DropShadow>
        </Button>
    );
}

export function Button({ onPressIn, onPressOut, onLongPress, lockToPress, style, children }) {

    const [isPressed, setIsPressed] = useState(false);

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPressIn={() => { 

                if (onPressIn) {
                    onPressIn();
                }
                
                if (!lockToPress) {

                    playButtonPress();
                } 

                setIsPressed(true);
            }}
            onPressOut={() => { 
                
                if (onPressOut) {
                    onPressOut();
                }
                
                if (!lockToPress) {
                    playButtonRelease();
                }

                setIsPressed(false);
            }}
            onLongPress={onLongPress}
            delayLongPress={300}>
            <Shadow

                inner={isPressed || lockToPress === true}
                useArt
                style={{
                    
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 1,
                    shadowColor: "darkgray",
                    shadowRadius: 4,

                    ...styles.button,
                    ...style
                }}>
                <View style={{ marginTop: (isPressed || lockToPress === true) ? 5 : 0 }}>{ children }</View>
            </Shadow>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 65,
        width: 65,
        margin: 8,
        marginTop: 13,
        borderRadius: 15,
        backgroundColor: "#fcfcfc",

        alignItems: "center",
        justifyContent: "center",
    },
    buttonActive: {

        backgroundColor: "#eaecec",

        textShadowColor: "darkgray",
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 2,

        color: "#8fb9ba",
    },
    buttonText: {

        fontFamily: "ptf",
        padding: 5,
        fontSize: 40,
        color: "#8aa7a8",
        textShadowColor: "darkgray",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,

    }, 
});
