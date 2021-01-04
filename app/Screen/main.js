import React, { Component, useEffect, useState } from 'react'
import {View, Text, StyleSheet} from 'react-native'
import * as Location from 'expo-location';




const API_KEY = 'c63e724fab43489ae4335fe01781d8a7';
const BASE_URL = 'http://api.openweathermap.org/data/2.5/weather?'

function Main() {

    const [errorMessage, setErrorMessage] = useState(null);
    const [currentWeather, setCurrentWeather] = useState(null);

    const load = async ()=>{
            try{
                let { status } = await Location.requestPermissionsAsync();
                if(status !== 'granted'){
                    setErrorMessage('Access To Location is Needed to run the App');
                    return
                }

                const location = await Location.getCurrentPositionAsync();
                const {latitude, longitude} = location.coords;

                const weatherURL = `${BASE_URL}lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

                const response = await fetch(weatherURL)

                const result = await response.json()

                if (response.ok) {
                    setCurrentWeather(result)
                } else {
                    setErrorMessage(result.message)
                }

            }catch(error){
                console.log(error);
            }
    }

    useEffect(()=>{
        load()
    },[]);

    if(currentWeather){
        const {
            main: {temp}
        } = currentWeather
        return (
            <View style={styles.container}>
                <Text>{temp}</Text>
            </View>
        )
    }else{
        return (
            <View style={styles.container}>
                <Text>{errorMessage}</Text>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})



export default Main

