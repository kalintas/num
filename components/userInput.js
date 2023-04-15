
import { StyleSheet, Text, View, Animated } from 'react-native';

import { useEffect, useState } from 'react';

import Blink from './blink';
import { TextButton, ImageButton } from './button';
import Popup from './popup';
import { playLoseSound, playWinSound } from '../lib/sound';

function renderButtons(names, numbersState, guessesState, secretNumber, fadeAnimsState, onNumberInput, allowInput) {

    let buttons = [];
    const [numbers, setNumbers] = numbersState;
    const [guesses, setGuesses] = guessesState;

    for (let i = 0; i < names.length; ++i) {

        const button = names[i];

        buttons.push(
            <FadeAnimation key={button} fadeAnimsState={fadeAnimsState}>
                <TextButton 
                    onPressIn={() => {
                        
                        if (!allowInput) {
                            return;
                        }

                        if (button === "<") {

                            if (numbers.length > 0) {
                
                                setNumbers(numbers.slice(0, numbers.length - 1));
                            }
                            
                        } else if (button === ">") {
                        
                            if (numbers.length == 3) {
                                
                                let number = numbers[0] + numbers[1] + numbers[2];
                                
                                setNumbers([]);
                                
                                // Dont process this number if onNumberInput returns false
                                if (onNumberInput && !onNumberInput(number)) { 
                                    return;                                    
                                }


                                if (guesses.length >= 9) {
                                    guesses.shift();
                                }

                                setGuesses(guesses.concat([{ value: number, result: getGuessResult(secretNumber, number) }]));
                            }

                        } else if (button) {
                            
                            if (numbers.length < 3 && !numbers.includes(button)) {
                                
                                setNumbers(numbers.concat([button]));
                            
                            } else {
                                // Erase the number
                                setNumbers(numbers.filter(number => number !== button));
                            }
                        }
                }}
                onLongPress={() => {
                    
                    if (button === "<") {

                        setNumbers([]);
                    }
                }}
                // Lock to press style if this button is in the input numbers
                lockToPress={ numbers.includes(button) }
                >
                    { button }
                </TextButton>
            </FadeAnimation>
        );
    }

    return (
        <View style={{flexDirection: "row"}}>
        
        {buttons}
        
        </View>
    );
}

function renderInputNumbers(numbers, allowInput) {

    let result = [];

    for (let i = 0; i < numbers.length; ++i) {

        result.push(
            <Text key={"number" + i} style={[styles.userNum, { fontSize: 70 }]}>{ numbers[i] }</Text>
        );
    }

    for (let i = numbers.length; i < 3; ++i) {

        let emptyNumber = (<Text key={"number" + i} style={[styles.userNum, { fontSize: 70 }]}>{ "_" }</Text>);

        // Blink the first empty number
        if (i == numbers.length && allowInput) {
            emptyNumber = <Blink key={"blink"} startOpacity={1.0} endOpactiy={0.2}>{ emptyNumber }</Blink>
        }

        result.push(emptyNumber);
    }

    return result;
}


function renderGuess(guess) {

    return (
        <View style={{flexDirection: "row", marginTop: 10, marginLeft: 5, marginRight: 5, alignItems: "center", justifyContent: "center"}}>
            <Text style={[styles.guessText, {width: 35, textAlign: "right"}]}>{ guess.value }</Text>
            <Text style={[styles.guessText, {paddingRight: 5, paddingLeft: 5, fontSize: 24}]}>|</Text>
            <Text style={[styles.guessText, {width: 35, letterSpacing: 0, textAlign: "left"}]}>{ guess.result }</Text>
        </View>
    );
}   

function renderGuesses(guesses) {

    let result = [];

    for (let i = 0; i < guesses.length;) {
        
        result.push(
            <View key={"guesses" + i} style={[styles.guessRow, 
                { justifyContent: (i === guesses.length - 2) ? "flex-start" : "center", marginLeft: (i === guesses.length - 2) ? 5 : 0 }]}>
                { renderGuess(guesses[i++]) }
                { i < guesses.length && renderGuess(guesses[i++]) }
                { i < guesses.length && renderGuess(guesses[i++]) }
            </View>
        );
    }

    return result;
}

function getGuessResult(secretNumber, guess) {

    let plusses = "";
    let minuses = "";

    for (let i = 0; i < 3; ++i) {

        for (let t = 0; t < 3; ++t) {

            if (secretNumber[i] === guess[t]) {

                if (i == t) {
                    plusses += "+";
                } else {
                    minuses += "-";
                }
                
                break;
            }
        }
    }

    if (plusses === "" && minuses === "") {
        return "X";
    }

    return plusses + minuses;
}

function FadeAnimation({ fadeAnimsState, style, children }) {

    const [fadeAnims, setFadeAnims] = fadeAnimsState;

    const [index, setIndex] = useState();

    useEffect(() => {

        fadeAnims.push(new Animated.Value(0));

        setFadeAnims(fadeAnims);
        setIndex(fadeAnims.length - 1);
    }, []);

    useEffect(() => {

        if (index === fadeAnims.length - 1) {
            
            const startAnimations = (index) => {
    
                if (index >= fadeAnims.length - 3) {
                    Animated.timing(fadeAnims[index], {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true,
                    }).start();
                } else {
                        
                    Animated.timing(fadeAnims[index], {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true,
                    }).start(() => {
                        startAnimations(index + 3);
                    });
                }
            };

            startAnimations(0);
            startAnimations(1);
            startAnimations(2);
        }

    }, [index])

    return (

        <Animated.View style={{...style, opacity: index !== undefined ? fadeAnims[index] : 0}}>
            
            { children }

        </Animated.View>
    );
}

export default function UserInput({ languageData, secretNumber, onPlayerWin, onRestart, onNumberInput, allowInput, playerLosed, navigation }) {

    const numbersState = useState([]);
    const guessesState = useState([]);
    const fadeAnimsState = useState([]);

    const [numbers, setNumbers] = numbersState;
    const [guesses, setGuesses] = guessesState;

    const [popup, setPopup] = useState(null);

    useEffect(() => {

        if (playerLosed) {

            setPopup("losed");
        }

    }, [playerLosed])

    useEffect(() => {

        if (popup === "losed") {
            
            playLoseSound();
            
        } else if (popup === "won") {
            
            playWinSound();
        }

    }, [popup])

    useEffect(() => {

        if (guesses.length > 0 && guesses[guesses.length - 1].result === "+++") {
            setPopup("won");
            if (onPlayerWin) {
                onPlayerWin();
            }
        }

    }, [guesses])

    return (
        <View style={styles.container}>


            <View style={styles.pauseButton}>       
                <ImageButton style={{ width: 40, height: 40 }} imageStyle={{ width: 15, height: 15 }} 
                        source={require("../assets/pause.png")} onPressOut={() => { setPopup("pause"); }}/>
            </View>


            <View style={styles.guesses}>
                { renderGuesses(guesses) }
            </View>

            <View style={styles.numbers}>

                { renderInputNumbers(numbers, allowInput) }

            </View>
            
            <View style={styles.numpad}>

                { renderButtons([ "1", "2", "3" ], numbersState, guessesState, secretNumber, fadeAnimsState, onNumberInput, allowInput) }
                { renderButtons([ "4", "5", "6" ], numbersState, guessesState, secretNumber, fadeAnimsState, onNumberInput, allowInput) }
                { renderButtons([ "7", "8", "9" ], numbersState, guessesState, secretNumber, fadeAnimsState, onNumberInput, allowInput) }
                { renderButtons([ "<", "0", ">" ], numbersState, guessesState, secretNumber, fadeAnimsState, onNumberInput, allowInput) }

            </View>

            <Popup 
                title={ languageData.mainMenu.popup[popup] } 
                onClose={popup === "pause" ? () => { setPopup(null); } : null} 
                visible={popup !== null}>

                <View style={styles.popup}>
                    
                    <TextButton style={{width: 250, height: 60}} textStyle={{fontSize: 27}} onPressOut={() => {

                        setNumbers([]);
                        setGuesses([]);
                        if (onRestart) {
                            onRestart();
                        }
                        setPopup(null);        

                    }}>{ languageData.mainMenu.popup.playAgain }</TextButton>
                    <TextButton style={{width: 250, height: 60}} textStyle={{fontSize: 27}} onPressOut={() => {
                        navigation.navigate("mainMenu");
                    }}>{ languageData.mainMenu.popup.mainMenu }</TextButton>

                    {
                        (popup === "pause") && 
                            <ImageButton style={{ width: 75, height: 75 }} imageStyle={{ width: 32, height: 32 }} 
                            source={require("../assets/play.png")} onPressOut={() => { setPopup(null); }}/>
                    }

                </View>
            </Popup>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
    
        backgroundColor: "#b0d4d4",
        flex: 1,

        alignItems: "center",
        justifyContent: "center",

    },
    pauseButton: {
        
        flexDirection: "row",
        alignItems: "center",   
        justifyContent: "center",
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
        width: 40,
        height: 40,
    },
    timerBar: {
        marginLeft: 5,
        backgroundColor: "#fcfcfc",
        width: 150,
        height: 40,
        borderRadius: 20,
    },
    numpad: {

        justifyContent: "center",
        alignItems: "center",
    
        marginBottom: 25,
    },
    numbers: {
        flexDirection: "row", 
        
        alignItems: "center",
        justifyContent: "center",

        marginTop: "auto", 
        marginBottom: 15
        
    },
    guesses: {

        marginTop: 30,
        width: 300,
        marginLeft: "auto",
        marginRight: "auto"
    },
    guessRow: {

        flexDirection: "row", 
        marginTop: 10,

        alignItems: "center",
    },
    guessText: {
        fontSize: 20,
        textShadowColor: "darkgray",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
        color: "#fcfcfc",
        fontFamily: "ptf"
    },
    popup: {
        alignItems: "center",
        justifyContent: "center",
    }


});
