// import React, { useState } from 'react';
// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View, TextInput, Button, ScrollView } from 'react-native';

// export default function App() {
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [latitude, setLatitude] = useState('');
//   const [longitude, setLongitude] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [airQualityData, setAirQualityData] = useState([]);
//   const [weatherData, setWeatherData] = useState([]);

//   const fetchDataForPage = async (page) => {
//     const formattedStartDate = encodeURIComponent(startDate);
//     const formattedEndDate = encodeURIComponent(endDate);
//     const lat = encodeURIComponent(latitude);
//     const lon = encodeURIComponent(longitude);
//     const start = new Date(startDate);
//     const end = new Date(endDate);
    
//     // Calculate the current date for the page
//     const currentDate = new Date(start);
//     currentDate.setDate(start.getDate() + page - 1);

//     // Check if current date exceeds end date
//     if (currentDate > end) {
//       return;
//     }

//     // Construct URL for air quality data
//     const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,aerosol_optical_depth,dust,uv_index,uv_index_clear_sky,ammonia&start_date=${currentDate.toISOString().split('T')[0]}&end_date=${currentDate.toISOString().split('T')[0]}`;

//     // Fetch air quality data
//     try {
//       const airQualityResponse = await fetch(airQualityUrl);
//       const airQualityData = await airQualityResponse.json();
//       setAirQualityData(prevData => [...prevData, airQualityData]);
//     } catch (error) {
//       console.error(`Error fetching air quality data for page ${page}: ${error.message}`);
//     }

//     // Construct URL for weather data
//     const weatherUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${currentDate.toISOString().split('T')[0]}&end_date=${currentDate.toISOString().split('T')[0]}&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,precipitation,rain,snowfall,pressure_msl,surface_pressure,cloudcover,cloudcover_low,cloudcover_mid,cloudcover_high,et0_fao_evapotranspiration,windspeed_10m,windspeed_100m,winddirection_10m,winddirection_100m,windgusts_10m`;

//     // Fetch weather data
//     try {
//       const weatherResponse = await fetch(weatherUrl);
//       const weatherData = await weatherResponse.json();
//       setWeatherData(prevData => [...prevData, weatherData]);
//     } catch (error) {
//       console.error(`Error fetching weather data for page ${page}: ${error.message}`);
//     }
//   };

//   const handleNextPage = () => {
//     setCurrentPage(prevPage => prevPage + 1);
//     fetchDataForPage(currentPage + 1);
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(prevPage => prevPage - 1);
//       fetchDataForPage(currentPage - 1);
//     }
//   };

//   const renderDataForPage = (page) => {
//     return (
//       <ScrollView key={page} style={styles.pageContainer}>
//         {/* Render air quality data for the page */}
//         {airQualityData[page - 1] && (
//           <View style={styles.column}>
//             <Text style={styles.label}>Air Quality Data (Page {page})</Text>
//             {Object.keys(airQualityData[page - 1].hourly).map((key, index) => (
//               <View key={index}>
//                 <Text style={styles.subLabel}>{key}</Text>
//                 {airQualityData[page - 1].hourly[key].map((value, index) => (
//                   <Text key={index}>{value}</Text>
//                 ))}
//               </View>
//             ))}
//           </View>
//         )}
//         {/* Render weather data for the page */}
//         {weatherData[page - 1] && (
//           <View style={styles.column}>
//             <Text style={styles.label}>Weather Data (Page {page})</Text>
//             {Object.keys(weatherData[page - 1].hourly).map((key, index) => (
//               <View key={index}>
//                 <Text style={styles.subLabel}>{key}</Text>
//                 {weatherData[page - 1].hourly[key].map((value, index) => (
//                   <Text key={index}>{value}</Text>
//                 ))}
//               </View>
//             ))}
//           </View>
//         )}
//       </ScrollView>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={styles.input}
//         placeholder="Start Date (YYYY-MM-DD)"
//         onChangeText={(text) => setStartDate(text)}
//         value={startDate}
//         keyboardType="numeric" // If you want to enforce numeric input
//         />
//       <TextInput
//         style={styles.input}
//         placeholder="End Date (YYYY-MM-DD)"
//         onChangeText={(text) => setEndDate(text)}
//         value={endDate}
//         keyboardType="numeric" // If you want to enforce numeric input
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Latitude"
//         onChangeText={(text) => setLatitude(text)}
//         value={latitude}
//         keyboardType="numeric" // If latitude should be numeric
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Longitude"
//         onChangeText={(text) => setLongitude(text)}
//         value={longitude}
//         keyboardType="numeric" // If longitude should be numeric
//       />
//       <Button title="Fetch Data" onPress={() => fetchDataForPage(1)} />
//       {/* Render data for current page */}
//       {renderDataForPage(currentPage)}
//       {/* Pagination buttons */}
//       <View style={styles.pagination}>
//         <Button title="Prev" onPress={handlePrevPage} disabled={currentPage === 1} />
//         <Button title="Next" onPress={handleNextPage} />
//       </View>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     padding: 20,
//     marginTop:100,
//   },
//   input: {
//     height: 40,
//     width: '100%',
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     paddingHorizontal: 10,
//   },
//   pageContainer: {
//     width: '100%',
//     marginBottom: 20,
//     marginTop:20,
//   },
//   pagination: {
//     marginTop:40,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     paddingHorizontal: 20,
//   },
//   column: {
//     width: '100%',
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     marginBottom: 10,
//   },
//   label: {
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   subLabel: {
//     fontWeight: 'bold',
//     marginBottom: 5,
//     marginTop: 10,
//   },
// });



// // import React, { useState, useEffect } from 'react';
// // import { StatusBar } from 'expo-status-bar';
// // import { StyleSheet, Text, View, TextInput, Button, ScrollView, Picker } from 'react-native';

// // // Define a list of Indian states and their corresponding cities with latitude and longitude
// // const indianStatesAndCities = {
// //   "Andhra Pradesh": [
// //     { name: "Visakhapatnam", latitude: 17.6868, longitude: 83.2185 },
// //     { name: "Vijayawada", latitude: 16.5062, longitude: 80.6480 },
// //     { name: "Hyderabad", latitude: 17.3850, longitude: 78.4867 },
// //     // Add more cities with latitude and longitude as needed
// //   ],
// //   // Add more states with cities, latitude, and longitude as needed
// // };

// // export default function App() {
// //   const [startDate, setStartDate] = useState('');
// //   const [endDate, setEndDate] = useState('');
// //   const [selectedState, setSelectedState] = useState('');
// //   const [selectedCity, setSelectedCity] = useState('');
// //   const [latitude, setLatitude] = useState('');
// //   const [longitude, setLongitude] = useState('');
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [airQualityData, setAirQualityData] = useState([]);
// //   const [weatherData, setWeatherData] = useState([]);

// //   useEffect(() => {
// //     // When the selected city changes, update latitude and longitude
// //     const city = indianStatesAndCities[selectedState].find(city => city.name === selectedCity);
// //     if (city) {
// //       setLatitude(city.latitude);
// //       setLongitude(city.longitude);
// //     }
// //   }, [selectedCity]);

// //   const fetchDataForPage = async (page) => {
// //     // Fetch data based on selected latitude and longitude
// //     const lat = encodeURIComponent(latitude);
// //     const lon = encodeURIComponent(longitude);
// //     // Rest of your fetch logic...
// //   };

// //   // Render dropdown menu for Indian states
// //   const renderStatesDropdown = () => {
// //     return (
// //       <Picker
// //         selectedValue={selectedState}
// //         style={{ height: 50, width: 200 }}
// //         onValueChange={(itemValue, itemIndex) => setSelectedState(itemValue)}
// //       >
// //         <Picker.Item label="Select State" value="" />
// //         {Object.keys(indianStatesAndCities).map((state, index) => (
// //           <Picker.Item key={index} label={state} value={state} />
// //         ))}
// //       </Picker>
// //     );
// //   };

// //   // Render dropdown menu for cities based on selected state
// //   const renderCitiesDropdown = () => {
// //     const cities = indianStatesAndCities[selectedState] || [];
// //     return (
// //       <Picker
// //         selectedValue={selectedCity}
// //         style={{ height: 50, width: 200 }}
// //         onValueChange={(itemValue, itemIndex) => setSelectedCity(itemValue)}
// //       >
// //         <Picker.Item label="Select City" value="" />
// //         {cities.map((city, index) => (
// //           <Picker.Item key={index} label={city.name} value={city.name} />
// //         ))}
// //       </Picker>
// //     );
// //   };

// //   // Rest of your code remains the same...

// //   return (
// //     <View style={styles.container}>
// //       {/* Render dropdowns for selecting state and city */}
// //       {renderStatesDropdown()}
// //       {selectedState && renderCitiesDropdown()}
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Start Date (YYYY-MM-DD)"
// //         onChangeText={(text) => setStartDate(text)}
// //         value={startDate}
// //         keyboardType="numeric" // If you want to enforce numeric input
// //       />
// //       <TextInput
// //         style={styles.input}
// //         placeholder="End Date (YYYY-MM-DD)"
// //         onChangeText={(text) => setEndDate(text)}
// //         value={endDate}
// //         keyboardType="numeric" // If you want to enforce numeric input
// //       />
// //       <Button title="Fetch Data" onPress={() => fetchDataForPage(1)} />
// //       {/* Rest of your code... */}
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#fff',
// //     alignItems: 'center',
// //     padding: 20,
// //     marginTop: 100,
// //   },
// //   input: {
// //     height: 40,
// //     width: '100%',
// //     borderColor: 'gray',
// //     borderWidth: 1,
// //     marginBottom: 10,
// //     paddingHorizontal: 10,
// //   },
// // });
