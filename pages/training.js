import { useState } from "react";
import UserInput from "../components/userInput";
import { SafeAreaView } from "react-native-safe-area-context";
import { generateRandomNumber } from "../lib/game";

export default function Training({ route, navigation }) {

    const [secretNumber, setSecretNumber] = useState(generateRandomNumber());

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#b0d4d4" }}>

            <UserInput 
                languageData={route.params.languageData}
                allowInput={true}
                secretNumber={secretNumber} 
                onRestart={() => { 
                    setSecretNumber(generateRandomNumber()) 
                }}
                navigation={navigation}/>
        
        </SafeAreaView>
    );
}
