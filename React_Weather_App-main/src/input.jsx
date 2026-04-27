import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from 'react';

export default function Input({ updateinfo }) { 
    let [city, setcity] = useState("");

    function textchange(e) {
        setcity(e.target.value);
    }

    async function handleclick(event) {
        event.preventDefault();
        const normalizedCity = city.trim();
        if (normalizedCity.length === 0) return;

        const api_key = import.meta.env.VITE_OPENWEATHER_API_KEY;
        const api_url = 'https://api.openweathermap.org/data/2.5/weather';

        try {
            if (!api_key) {
                throw new Error('Missing API key. Set VITE_OPENWEATHER_API_KEY in .env');
            }

            let response = await fetch(
                `${api_url}?q=${encodeURIComponent(normalizedCity)}&appid=${api_key}&units=metric`
            );

            let json = await response.json();

            if (!response.ok) {
                throw new Error(json.message || 'City not found');
            }

            let result = {
                city: json.name, 
                temp: json.main.temp,
                tempMin: json.main.temp_min,
                tempMax: json.main.temp_max,
                humidity: json.main.humidity,
                feelsLike: json.main.feels_like,
                weather: json.weather[0].description,
            };

            updateinfo(result);
            setcity(""); 
            
        } catch (err) {
            alert(err.message || "City not found or API request failed");
        }
    }

    return (
        <form onSubmit={handleclick}>
            <TextField 
                id="outlined-basic"  
                variant="outlined" 
                placeholder='Enter City Name'
                sx={{
                    border: '2px solid red', 
                    borderRadius: '4px',
                    input: { color: 'black' }
                }} 
                value={city} 
                onChange={textchange}
            />
            <br />
            <Button 
                variant="contained" 
                style={{ marginTop: '5px', backgroundColor: 'white', color: 'black', marginBottom: '5px' }} 
                type='submit'
            >
                Search
            </Button>
        </form>
    );
}
