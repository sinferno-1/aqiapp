import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, ScrollView, TouchableOpacity,ImageBackground, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function App() {
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [airQualityData, setAirQualityData] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [model, setModel] = useState(null);

  useEffect(() => {
    // Load data from in.json file
    const loadData = async () => {
      try {
        const data = require('./assets/cities.json');
        const uniqueStates = [...new Set(data.map(item => item.admin_name))];
        setStates(uniqueStates);
  
        // Filter cities based on the initially selected state
        if (selectedState !== '') {
          const filteredCities = data.filter(city => city.admin_name === selectedState);
          setCities(filteredCities);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, [selectedState]);

  const fetchDataForDate = async () => {
  
    const cityObject = cities.find(city => city.city === selectedCity);
    if (!cityObject) return;

    const { lat, lng } = cityObject;

    const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=us_aqi&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,aerosol_optical_depth,dust,uv_index,uv_index_clear_sky,ammonia,us_aqi&start_date=${currentDate}&end_date=${currentDate}`;
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&start_date=${currentDate}&end_date=${currentDate}&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,precipitation,rain,snowfall,pressure_msl,surface_pressure,cloudcover,cloudcover_low,cloudcover_mid,cloudcover_high,et0_fao_evapotranspiration,windspeed_10m,windspeed_100m,winddirection_10m,winddirection_100m,windgusts_10m`;
    try {
      const airQualityResponse = await fetch(airQualityUrl);
      const airQualityData = await airQualityResponse.json();
      console.log(airQualityData);
      // Fetch weather data
      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();
  
      // Combine air quality and weather data
      const combinedData = combineData(airQualityData, weatherData);
      setAirQualityData(combinedData);
    } catch (error) {
      console.error(`Error fetching data: ${error.message}`);
    }
  };

  const fetchDataForCurrent = async (latitude, longitude) => {
  
    const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,aerosol_optical_depth,dust,uv_index,uv_index_clear_sky,ammonia,us_aqi&start_date=${currentDate}&end_date=${currentDate}`;
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&start_date=${currentDate}&end_date=${currentDate}&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,precipitation,rain,snowfall,pressure_msl,surface_pressure,cloudcover,cloudcover_low,cloudcover_mid,cloudcover_high,et0_fao_evapotranspiration,windspeed_10m,windspeed_100m,winddirection_10m,winddirection_100m,windgusts_10m`;
    try {
      // Fetch air quality data
      const airQualityResponse = await fetch(airQualityUrl);
      const airQualityData = await airQualityResponse.json();
      
      // Fetch weather data
      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();
      
      // Combine air quality and weather data
      const combinedData = combineData(airQualityData, weatherData);
      // Set combined data in state
      setAirQualityData(combinedData);
    } catch (error) {
      console.error(`Error fetching data: ${error.message}`);
    }
  };
  
  const combineData = (airQuality, weather) => {
    const combinedData = [];
    const airQualityHourly = airQuality.hourly;
  
    for (let i = 0; i < airQualityHourly.time.length; i++) {
      const timeStamp = airQualityHourly.time[i];
      const airQualityValues = {};
  
      // Extract air quality values for the current timestamp
      for (const key in airQualityHourly) {
        if (key !== 'time' && airQualityHourly.hasOwnProperty(key)) {
          airQualityValues[key] = airQualityHourly[key][i];
        }
      }
  
      // Extract weather values for the current timestamp
      const weatherValues = {};
      for (const key in weather.hourly) {
        if (weather.hourly.hasOwnProperty(key)) {
          weatherValues[key] = weather.hourly[key][i];
        }
      }
  
      // Combine air quality and weather values
      const combinedEntry = { timeStamp, ...airQualityValues, ...weatherValues };
      combinedData.push(combinedEntry);
    }
  
    return combinedData;
  };
  
  const fetchLocationData = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    fetchDataForCurrent(latitude, longitude);
  };
  
  const sendPredictionRequest = async () => {
    try {
      const new_data_sequence = airQualityData.map(item => [
        [
          item.carbon_monoxide,
          item.nitrogen_dioxide,
          item.ozone,
          item.pm10,
          item.pm2_5,
          item.sulphur_dioxide,
          item.temperature_2m,
          item.relativehumidity_2m,
          item.dewpoint_2m,
          item.precipitation,
          item.rain,
          item.snowfall,
          item.pressure_msl,
          item.surface_pressure,
          item.cloudcover,
          item.windspeed_10m
        ]
      ]);
  
      const input_data = new_data_sequence;
  
      const url = 'https://little-snow-18911.pktriot.net/predict';
      const data = { input: input_data };
      const headers = { 'Content-Type': 'application/json' };
  
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        Alert.alert('Server Error' , 'Please try later');
      }
  
      const responseData = await response.json();
      Alert.alert('Prediction', `Prediction: ${responseData.prediction*499*-1}`);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Server Error', 'Failed to get prediction');
    }
  }
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1; // Show 1 hour of data per page

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  const currentData = airQualityData.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPage < Math.ceil(airQualityData.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  return (
    <ImageBackground source={require('./wallpaper.jpeg')} style={styles.background}>
      <ScrollView style={styles.container}>
      <View style={styles.picker}>
      <Picker
        selectedValue={selectedState}
        style={styles.input}
        onValueChange={(itemValue) => setSelectedState(itemValue)}>
        <Picker.Item label="Select State" value="" />
        {states.map((state, index) => (
          <Picker.Item key={index} label={state} value={state} />
        ))}
      </Picker>
      <Picker
        selectedValue={selectedCity}
        style={styles.input}
        onValueChange={(itemValue) => setSelectedCity(itemValue)}>
        <Picker.Item label="Select City" value="" />
        {cities.map((city, index) => (
          <Picker.Item key={index} label={city.city} value={city.city} />
        ))}
      </Picker>
      </View>
      <View style={styles.date}>
      <Text style={styles.label}>Fetching For Current Date: {currentDate}</Text>
      </View>
      <View style={styles.button}>
        <TouchableOpacity onPress={fetchDataForDate} style={styles.curr}>
        <Icon name="downloading" size={25} color="#142368" />
        <Text style={styles.txt}>For Selected City</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.curr} onPress={fetchLocationData}>
        {/* <Text style={styles.buttonText}>Use Current Location</Text> */}
        <Icon name="location-searching" size={25} color="#142368" />
        <Text style={styles.txt}>Use Current location</Text>
      </TouchableOpacity>
      </View>

      {currentData.length > 0 && (
      <TouchableOpacity onPress={sendPredictionRequest} style={styles.predictButton}>
        <Text style={styles.predictButtonText}>Get AQI Prediction</Text>
      </TouchableOpacity>
      )}

      {currentData.length > 0 && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical:8 }}>
          <TouchableOpacity onPress={previousPage} disabled={currentPage === 1} style={styles.pagination}><Icon name="arrow-back-ios" size={25} color="#142368" /></TouchableOpacity>
          <TouchableOpacity onPress={nextPage} disabled={currentPage === Math.ceil(airQualityData.length / itemsPerPage)} style={styles.pagination}><Icon name="arrow-forward-ios" size={25} color="#142368" /></TouchableOpacity>
        </View>
      )}
      {/* Render combined data */}
      {currentData.map((entry, index) => (
        <View key={index} style={styles.column}>
          <Text style={styles.subLabel}>{entry.timeStamp}</Text>
          {Object.entries(entry).map(([key, value]) => (
            <Text style={styles.obj} key={key}>{`${key}: ${value}`}</Text>
          ))}
        </View>
      ))}
      
      {/* Pagination buttons */}
      {currentData.length > 0 && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }}>
        <TouchableOpacity onPress={previousPage} disabled={currentPage === 1} style={styles.pagination}><Icon name="arrow-back-ios" size={25} color="#142368" /></TouchableOpacity>
        <TouchableOpacity onPress={nextPage} disabled={currentPage === Math.ceil(airQualityData.length / itemsPerPage)} style={styles.pagination}><Icon name="arrow-forward-ios" size={25} color="#142368" /></TouchableOpacity>
      </View>
      )}
      <StatusBar style="auto" />
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth:0,
    height:'100%',
    paddingHorizontal:5,
    marginTop:50,
    backgroundColor: 'rgba(255, 255, 255, 0.0)',
  },
  pagination:{
    alignContent:'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems:'center',
    alignSelf:'center',
    borderRadius:10,
    padding:5,
    borderColor:'black',
    borderWidth:1,

  },
  predictButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 5,
    alignItems: 'center',
    borderWidth:1
  },
  predictButtonText: {
    color: 'white',
    fontWeight: 'bold',
    color:'#142368',
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },

  input: {
    height: 40,
    width: '100%',
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 30,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  column: {
    padding: 30,
    marginBottom: 10,
    paddingHorizontal:20,
    marginTop:2,
    backgroundColor:'white',
    borderColor:'black',
    borderWidth:1,
    borderRadius:10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth:1

   
  },
  label: {
    fontWeight: 'bold',
    backgroundColor: 'rgba(255, 255, 255, 0.0)',
    
  },
  subLabel: {
    fontWeight: 'bold',
    margin: 5,
    
  },
  obj:{
    marginBottom:10
  },
  button:{
    flexDirection:'row',
    alignContent:'center',
    alignItems:'center',
    marginVertical:1,
    backgroundColor: 'white',
    alignItems:'center',
    paddingVertical:2,
    justifyContent:'space-evenly',
    borderColor:'#a9a9a9',
    borderRadius:10,
    backgroundColor: 'rgba(255, 255, 255, 0.0)',
  },
  curr:{
    color:'blue',
    borderColor:'black',
    borderWidth:1,
    height:'100%',
    alignContent:'center',
    alignItems:'center',
    alignSelf:'center',
    borderRadius:10,
    padding:5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  picker:{
    alignContent:'center',
    alignItems:'center',
    marginVertical:2,
    borderColor:'black',
    borderWidth:1,
    padding:5,
    borderRadius:10,
    backgroundColor: 'rgba(255, 255, 255, 0.0)',
  },
  date:{
    alignContent:'center',
    alignItems:'center',
    marginVertical:2,
    backgroundColor: 'white',
    alignItems:'center',
    borderColor:'black',
    borderWidth:1,
    borderRadius:10,
    padding:5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  txt:{
    color:'#142368',
    backgroundColor: 'rgba(255, 255, 255, 0.0)',
  }
});