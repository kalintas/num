
import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export default function Blink({ startOpacity, endOpactiy, children }) {

    const opacity = useRef(new Animated.Value(startOpacity)).current;

    useEffect(() => {

        const toggleOpacity = (opacities, index) => {

            Animated.timing(opacity, {
                toValue: opacities[index],
                duration: 400,
                useNativeDriver: true,    
            }).start(() => {

                toggleOpacity(opacities, 1 - index);
            })
        }

        toggleOpacity([ startOpacity, endOpactiy ], 0);

    }, [opacity])

    return (
        <Animated.View style={{ opacity: opacity }}>{ children }</Animated.View>
    );
}
