import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const DataDisplay = ({ airQualityData, weatherData }) => {
  return (
    <ScrollView style={styles.container}>
      {/* Render air quality data */}
      <View style={styles.column}>
        <Text style={styles.label}>Air Quality Data</Text>
        {Object.keys(airQualityData).map((key, index) => (
          <View key={index}>
            <Text style={styles.subLabel}>{key}</Text>
            {airQualityData[key].map((value, index) => (
              <Text key={index}>{value}</Text>
            ))}
          </View>
        ))}
      </View>

      {/* Render weather data */}
      <View style={styles.column}>
        <Text style={styles.label}>Weather Data</Text>
        {Object.keys(weatherData).map((key, index) => (
          <View key={index}>
            <Text style={styles.subLabel}>{key}</Text>
            {weatherData[key].map((value, index) => (
              <Text key={index}>{value}</Text>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  column: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
  },
});

export default DataDisplay;
