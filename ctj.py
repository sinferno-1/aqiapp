import csv
import json

# Read CSV file
with open('cities.csv', newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    data = []
    for row in reader:
        # Include only required fields
        city_data = {
            'city': row['city'],
            'state': row['State'],  # Use 'State' column for state name
            'lat': str(row['Lat']), # Convert lat to string
            'lng': str(row['Long']) # Convert lng to string
        }
        # Append to data list
        data.append(city_data)

# Write JSON file
with open('cities.json', 'w', encoding='utf-8') as jsonfile:
    json.dump(data, jsonfile, indent=2)
