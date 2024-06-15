import requests
import json

# Function to fetch and append maximum and minimum us_aqi values for each city
def fetch_and_append_us_aqi(city):
    try:
        # Extract latitude and longitude from the city object
        lat = float(city.get("lat"))
        lng = float(city.get("lng"))
        
        # Construct the API URL for fetching air quality data
        api_url = f"https://air-quality-api.open-meteo.com/v1/air-quality?latitude={lat}&longitude={lng}&hourly=us_aqi&start_date=2022-08-10&end_date=2024-05-26"
        
        # Make the API request
        response = requests.get(api_url)
        
        if response.status_code == 200:
            data = response.json()
            
            # Extract hourly us_aqi values from the API response
            hourly_aqi_values = data.get("hourly", {}).get("us_aqi")
            
            if hourly_aqi_values:
                # Find the maximum and minimum us_aqi values
                max_aqi = max(hourly_aqi_values)
                min_aqi = min(hourly_aqi_values)
                
                # Append max and min us_aqi values to the city object
                city["max_values"]["us_aqi_max"] = max_aqi
                city["min_values"]["us_aqi_min"] = min_aqi
            else:
                print(f"No hourly us_aqi data available for {city.get('city')}")
        else:
            print(f"Error fetching air quality data for {city.get('city')}: Status code {response.status_code}")
    except Exception as e:
        print(f"Error fetching air quality data for {city.get('city')}: {e}")

# Read the city data from JSON file
with open("cities_with_meteo.json", "r") as file:
    cities_json = json.load(file)

# Iterate over each city and fetch air quality data
for city in cities_json:
    fetch_and_append_us_aqi(city)

# Print the updated city JSON structure
with open("cities_with_meteo.json", "w") as file:
    json.dump(cities_json, file, indent=2)