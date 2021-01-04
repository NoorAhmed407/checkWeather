import React, { Component, useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native'
import * as Location from 'expo-location';
import WeatherInfo from './../Component/WeatherInfo'
import UnitsPicker from './../Component/unitPicker'
import ReloadIcon from './../Component/ReloadIcon'
import WeatherDetails from './../Component/WeatherDetails'
import { colors } from './../utils/index'




const API_KEY = 'c63e724fab43489ae4335fe01781d8a7';
const BASE_URL = 'http://api.openweathermap.org/data/2.5/weather?'

function Main() {

    const [errorMessage, setErrorMessage] = useState(null);
    const [currentWeather, setCurrentWeather] = useState(null);
    const [unitSystem,setUnitSystem] = useState('imperial');

    const load = async ()=>{
            try{
                let { status } = await Location.requestPermissionsAsync();
                if(status !== 'granted'){
                    setErrorMessage('Access To Location is Needed to run the App');
                    return
                }

                const location = await Location.getCurrentPositionAsync();
                const {latitude, longitude} = location.coords;

                const weatherURL = `${BASE_URL}lat=${latitude}&lon=${longitude}&units=${unitSystem}&appid=${API_KEY}`;

                const response = await fetch(weatherURL)

                const result = await response.json()

                if (response.ok) {
                    setCurrentWeather(result)
                } else {
                    setErrorMessage(result.message)
                }

            }catch(error){
                setErrorMessage(error.message);
            }
    }

    useEffect(()=>{
        load()
    },[]);

    if (currentWeather) {
        return (
            <View style={styles.container}>
                <StatusBar style="auto" />
                <View style={styles.main}>
                    <UnitsPicker unitsSystem={unitSystem} setUnitsSystem={setUnitSystem} />
                    <ReloadIcon load={load} />
                    <WeatherInfo currentWeather={currentWeather} />
                </View>
                <WeatherDetails currentWeather={currentWeather} unitsSystem={unitSystem} />
            </View>
        )
    } else if (errorMessage) {
        return (
            <View style={styles.container}>
                <ReloadIcon load={load} />
                <Text style={{ textAlign: 'center' }}>{errorMessage}</Text>
                <StatusBar style="auto" />
            </View>
        )
    } else {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={colors.PRIMARY_COLOR} />
                <StatusBar style="auto" />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    main: {
        justifyContent: 'center',
        flex: 1,
    },
})



export default Main

