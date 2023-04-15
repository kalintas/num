

import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

import ImmersiveMode from 'react-native-immersive-mode';
ImmersiveMode.setBarMode('FullSticky');

import MainMenu from "./pages/mainMenu";
import Training from "./pages/training";
import Play from "./pages/play";
import { useEffect } from "react";


export default function App() {

    useEffect(() => {

        ImmersiveMode.fullLayout(true);

        return () => {
            ImmersiveMode.fullLayout(false);
        }
    }, [])

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                
                <Stack.Navigator screenOptions={{headerShown: false}}>
                    <Stack.Screen name="mainMenu" component={MainMenu}/>

                    <Stack.Screen name="play" component={Play}/>
                    <Stack.Screen name="training" component={Training}/>
                </Stack.Navigator>

            </NavigationContainer>
        </SafeAreaProvider>
    );
}

