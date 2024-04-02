import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, ScrollView } from 'react-native';

export default function App() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [airQualityData, setAirQualityData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  const fetchData = async () => {
    const formattedStartDate = encodeURIComponent(startDate);
    const formattedEndDate = encodeURIComponent(endDate);
    const lat = encodeURIComponent(latitude);
    const lon = encodeURIComponent(longitude);

    // First API call for air quality data
    const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,aerosol_optical_depth,dust,uv_index,uv_index_clear_sky,ammonia&start_date=${formattedStartDate}&end_date=${formattedEndDate}`;

    try {
      const airQualityResponse = await fetch(airQualityUrl);
      const airQualityData = await airQualityResponse.json();
      console.log(airQualityData);
      setAirQualityData(airQualityData);
    } catch (error) {
      console.error(`Error fetching air quality data: ${error.message}`);
    }

    // Second API call for weather data
    const weatherUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${formattedStartDate}&end_date=${formattedEndDate}&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,precipitation,rain,snowfall,pressure_msl,surface_pressure,cloudcover,cloudcover_low,cloudcover_mid,cloudcover_high,et0_fao_evapotranspiration,windspeed_10m,windspeed_100m,winddirection_10m,winddirection_100m,windgusts_10m`;

    try {
      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();
      console.log(weatherData);
      setWeatherData(weatherData);
    } catch (error) {
      console.error(`Error fetching weather data: ${error.message}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Start Date (YYYY-MM-DD)"
        onChangeText={(text) => setStartDate(text)}
        value={startDate}
        keyboardType="numeric" // If you want to enforce numeric input
      />
      <TextInput
        style={styles.input}
        placeholder="End Date (YYYY-MM-DD)"
        onChangeText={(text) => setEndDate(text)}
        value={endDate}
        keyboardType="numeric" // If you want to enforce numeric input
      />
      <TextInput
        style={styles.input}
        placeholder="Latitude"
        onChangeText={(text) => setLatitude(text)}
        value={latitude}
        keyboardType="numeric" // If latitude should be numeric
      />
      <TextInput
        style={styles.input}
        placeholder="Longitude"
        onChangeText={(text) => setLongitude(text)}
        value={longitude}
        keyboardType="numeric" // If longitude should be numeric
      />
      <Button title="Fetch Data" onPress={fetchData} />
      {airQualityData && weatherData && (
        <View style={styles.dataContainer}>
          <View style={styles.row}>
            {/* Display air quality data */}
            <View style={styles.column}>
              <Text style={styles.label}>Air Quality Data</Text>
              {Object.keys(airQualityData.hourly).map((key, index) => (
                <View key={index}>
                  <Text style={styles.subLabel}>{key}</Text>
                  {airQualityData.hourly[key].map((value, index) => (
                    <Text key={index}>{value}</Text>
                  ))}
                </View>
              ))}
            </View>
            {/* Display weather data */}
            <View style={styles.column}>
              <Text style={styles.label}>Weather Data</Text>
              {Object.keys(weatherData.hourly).map((key, index) => (
                <View key={index}>
                  <Text style={styles.subLabel}>{key}</Text>
                  {weatherData.hourly[key].map((value, index) => (
                    <Text key={index}>{value}</Text>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </View>
      )}
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop:100,
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  dataContainer: {
    marginTop: 20,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  column: {
    width: '50%', // Two columns in a row
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
  },
});
