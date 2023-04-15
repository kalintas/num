import { Text, StyleSheet, View, Image, Linking } from "react-native";

import { ImageButton, TextButton } from "../components/button";
import { useEffect, useState } from "react";

import Popup from "../components/popup";
import { setMuted } from "../lib/sound";
import { SafeAreaView } from "react-native-safe-area-context";


const LANGUAGE_TR = require("../assets/language/tr.json");
const LANGUAGE_EN = require("../assets/language/en.json");

export default function MainMenu({ navigation }) {
    
    const [popup, setPopup] = useState(null);

    const [creditsAnimStart, setCreditAnimStart] = useState(false);

    const [gameMuted, setGameMuted] = useState(false);
    const [language, setLanguage] = useState("tr");

    const [languageData, setLanguageData] = useState(LANGUAGE_TR);

    useEffect(() => {

        setMuted(gameMuted);

    }, [gameMuted]);

    return (

        <SafeAreaView style={[styles.container]}>

            <Image style={styles.logo} source={require("../assets/logo.png")}/>
            
            <TextButton style={{width: 250}} textStyle={{fontSize: 25}} onPressIn={() => { navigation.navigate("play", { languageData }); }}>{ languageData.mainMenu.play.name }</TextButton>
            <TextButton style={{width: 250}} textStyle={{fontSize: 25}} onPressIn={() => { navigation.navigate("training", { languageData }); }}>{ languageData.mainMenu.training.name }</TextButton>
            <TextButton style={{width: 250}} textStyle={{fontSize: 25}} onPressIn={() => { setPopup("howtoplay"); }}>{ languageData.mainMenu.howToPlay.name }</TextButton>
            <TextButton style={{width: 250}} textStyle={{fontSize: 25}} onPressIn={() => { setPopup("settings"); }}>{ languageData.mainMenu.settings.name }</TextButton>
            
            <Popup title="NUM" visible={popup === "howtoplay"} onClose={ () => { setPopup(null) } }>
                <Text style={styles.popupText}>{ languageData.mainMenu.howToPlay.content[0] }</Text>
                <Text style={styles.popupText}>{ languageData.mainMenu.howToPlay.content[1] }</Text>
                <Text style={styles.popupText}>{ languageData.mainMenu.howToPlay.content[2] }</Text>
                <Text style={styles.popupText}>{ languageData.mainMenu.howToPlay.content[3] }</Text>
            </Popup>

            <Popup title={ languageData.mainMenu.settings.name } visible={popup === "settings"} startAnimPos={creditsAnimStart ? 800 : 0} endAnimPos={creditsAnimStart ? -800 :  0} endAnimCallback={() => { setCreditAnimStart(false); }} onClose={ () => { setPopup(null) } }>

                <View style={styles.settingsRow}>
                    
                    <ImageButton imageStyle={styles.settingsImage} onPressOut={() => { setLanguage("tr"); setLanguageData(LANGUAGE_TR); }} lockToPress={ language === "tr" } source={require("../assets/tr.png")}/>
                    <ImageButton imageStyle={styles.settingsImage} onPressOut={() => { setLanguage("en"); setLanguageData(LANGUAGE_EN); }} lockToPress={ language === "en" } source={require("../assets/en.png")}/>
                </View>

                <View style={styles.settingsRow}>

                    {/* mute/unmute  */}
                    <ImageButton imageStyle={styles.settingsImage} onPressOut={() => { setGameMuted(!gameMuted) }} 
                        source={ gameMuted ? require("../assets/novolume.png") : require("../assets/volume.png")}/>

                    {/* go to credits */}
                    <ImageButton imageStyle={styles.settingsImage} onPressOut={() => { setPopup("credits"); setCreditAnimStart(true); }} source={require("../assets/credits.png")}/>
                </View>
            </Popup>

            <Popup title={ languageData.mainMenu.settings.aboutUs } visible={popup === "credits"} startAnimPos={800} endAnimPos={800} onGoBack={() => { setPopup("settings"); }}>

                <View style={styles.settingsRow}>

                    <View style={styles.infoCard}>

                        <Image style={styles.profilePhoto} source={require("../assets/ti.jpg")}/>
                        <Text style={styles.infoHeader}>{"Talha\nİbrikçi"}</Text>
                        <Text style={styles.infoText}>"Designer"</Text>
                        <ImageButton imageStyle={styles.settingsImage} onPressOut={() => { Linking.openURL("instagram://user?username=thetibrikci"); }} source={require("../assets/instagram.png")}/>

                    </View>
                    
                    <View style={styles.infoCard}>

                        <Image style={styles.profilePhoto} source={require("../assets/kk.png")}/>
                        <Text style={styles.infoHeader}>{"Kerem\nKalıntaş"}</Text>
                        <Text style={styles.infoText}>"Coder"</Text>
                    
                        <ImageButton imageStyle={styles.settingsImage} onPressOut={() => { Linking.openURL("instagram://user?username=kerem.kalintas"); }} source={require("../assets/instagram.png")}/>
                    </View>
                    
                </View>
            </Popup>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#b0d4d4",
        flex: 1,

        alignItems: "center",   
        justifyContent: "center",
    },
    logo: {

        width: 175,
        height: 175,
        marginBottom: 75,
    },
    popupText: {
        
        fontFamily: "primer",
        color: "#fcfcfc",

        marginTop: 20,
    },  
    settingsRow: {
        flexDirection: "row",
        alignItems: "center",   
        justifyContent: "center",
        
    },
    settingsImage: {
        width: 48,
        height: 48,
    },
    infoCard: {
        padding: 20,

        alignItems: "center",   
        justifyContent: "center",
    },
    infoHeader: {
        fontFamily: "primer",
        color: "#fcfcfc",
        fontSize: 35,
        textAlign: "center",
    },
    infoText: {
        fontFamily: "primer",
        color: "#fcfcfc",
        fontSize: 25,
        textAlign: "center",
    },
    profilePhoto: {
        width: 100,
        height: 100,
        borderRadius: 50,
    }

});
