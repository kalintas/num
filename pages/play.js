import { StyleSheet, View, Text, Image } from "react-native";
import UserInput from "../components/userInput";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { Animated } from "react-native";
import { generateRandomNumber } from "../lib/game";
import { Shadow } from 'react-native-neomorph-shadows';
import { playTimeoutSound, playTurnSound, stopTimeoutSound } from "../lib/sound";

const ROUND_TIME = 10; // 10 second

function randomInt(start, end) {
    
    return Math.floor(Math.random() * (end - start)) + start;
}

export default function Play({ route, navigation }) {

    const languageData = route.params.languageData;

    const [secretNumber, setSecretNumber] = useState();

    const [computerSecretNumber, setComputerSecretNumber] = useState();
    const [computerTurn, setComputerTurn] = useState();

    const [computerLuck, setComputerLuck] = useState();

    const [playerLosed, setPlayerLosed] = useState();

    const [timeLeft, setTimeLeft] = useState();
    const [timerColor, setTimerColor] = useState();

    const [timerAnimation, setTimerAnimation] = useState();

    const [playerTimeout, setPlayerTimeout] = useState();

    const [restartGame, setRestartGame] = useState(true);

    useEffect(() => {

        return () => {

            if (playerTimeout) {
                clearTimeout(playerTimeout);
            }

        }
    });

    useEffect(() => {

        if (restartGame) {

            setSecretNumber(null); 
            setComputerSecretNumber(generateRandomNumber());
            
            const isComputerTurn = Math.random() < 0.5;
            setComputerTurn(isComputerTurn);
            
            setTimerColor(isComputerTurn ? "#F55575" : "#fcfcfc");

            setComputerLuck(0.00138);
        
            setPlayerLosed(null);
            setTimeLeft(new Animated.Value(100));

            if (playerTimeout) {
                clearTimeout(playerTimeout);
            }

            setRestartGame(false);
        }
    }, [restartGame]);

    useEffect(() => {

        if (!secretNumber || playerLosed !== null) {
            return;
        }

        const animation = Animated.timing(timeLeft, {
            toValue: 0,
            duration: ROUND_TIME * 1000,
            useNativeDriver: false,
        });

        const currentTurn = computerTurn;

        animation.start(({ finished }) => {

            if ((finished && currentTurn === computerTurn) || !finished) {
            
                setTimerColor(!computerTurn ? "#F55575" : "#fcfcfc");
                setComputerTurn(!computerTurn);    
                setTimeLeft(new Animated.Value(100));
            }
        });
        

        if (computerTurn) {

            if (playerTimeout) {
                clearTimeout(playerTimeout);
                setPlayerTimeout(null);
            } 

            setTimeout(() => {

                if (Math.random() < computerLuck) {
                    
                    setPlayerLosed(true);
                    
                } else {
                    
                    setComputerLuck(computerLuck + 0.03);
                }

                animation.stop();
                
            }, randomInt(randomInt(2000, 4000), randomInt(6000, 10000)));

        } else {

            playTurnSound();

            setPlayerTimeout(setTimeout(() => {

                setTimerColor(timeLeft.interpolate({

                    inputRange: [0, 5, 10, 15, 20, 25, 30],
                    outputRange: [ "#fcfcfc", "#F55575", "#fcfcfc", "#F55575", "#fcfcfc", "#F55575", "#fcfcfc" ]
                }));

                playTimeoutSound();

            }, (ROUND_TIME - 3) * 1000));
        }

        setTimerAnimation(animation);

    }, [secretNumber, timeLeft]);


    return (
        <SafeAreaView style={styles.container}>

            <UserInput 
                languageData={languageData}
                secretNumber={computerSecretNumber} 
                onPlayerWin={() => { setPlayerLosed(false); }}
                onRestart={() => { setRestartGame(true); }}
                allowInput={!computerTurn || !secretNumber}
                playerLosed={playerLosed}
                onNumberInput={(number) => {

                    if (!secretNumber) {
                        setSecretNumber(number);
                        return false;
                    }

                    stopTimeoutSound();
                    timerAnimation.stop();
                
                    return true;
                }}
                navigation={navigation}/>
    
            <View style={styles.userBar}>

                <View style={{ marginLeft: "auto", marginRight: "auto", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <Image style={styles.icon} source={require("../assets/user.png")}/>
                    <Text style={styles.userNum}>{ secretNumber }</Text>
                </View>

                <View style={{ marginLeft: "auto", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>

                    <Image style={[styles.icon, { marginRight: 5 }]} source={require("../assets/timer.png")}/>
                    

                    <Shadow
                        inner
                        useArt
                        style={{
                            
                            shadowOffset: { width: 0, height: 3 },
                            shadowOpacity: 1,
                            shadowColor: "darkgray",
                            shadowRadius: 3,
                            width: 100,
                            ...styles.timerBar
                        }}>
  
                        <Animated.View style={[styles.timerBarInner, { width: timeLeft, backgroundColor: timerColor }]}/>
                    </Shadow>
                    

                </View>

            </View>
            
            {
                !secretNumber && 
                <Text style={[styles.userNum, styles.enterInputText]}>{ languageData.mainMenu.play.enterNumber }</Text>
            }

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    container: {
        
        flex: 1, 
        backgroundColor: "#b0d4d4",

        alignItems: "center",   
        justifyContent: "center",
    },
    userBar: {
        
        pointerEvents: "none",
        position: "absolute",
        top: 13,
        width: 330,
        flexDirection: "row",
        alignItems: "center",   
        justifyContent: "center",
    },
    enterInputText: {
        position: "absolute",
        top: 200,
        textAlign: "center",
    },
    userNum: {
        fontSize: 23,
        letterSpacing: 8,
        textShadowColor: "darkgray",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
        color: "#fcfcfc",
        fontFamily: "ptf"
    },
    icon: {
        width: 30,
        height: 30,
    },
    timerBar: {
        width: 100,
        backgroundColor: "#8aa7a8",
        height: 40,
        borderRadius: 20,
        overflow: "hidden"
    },
    timerBarInner: {
        borderRadius: 20, 
        height: 40,
        backgroundColor: "#fcfcfc" 
    }

});