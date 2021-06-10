export const PHOTO_URL = "https://admin.moodflo.com/";
import moment from 'moment';

export const hapticsConfigs = {
  car: {
    light: "impactLight",
    medium: "impactMedium",
    high: "impactHeavy"
  },
  heartBeat: {
    light: "notificationSuccess",
    medium: "notificationWarning",
    high: "notificationError"
  },
}

export const hapticsTopFlags = {
  left: "left",
  right: "right",
  both: "both",
}

export const dataTypes = {
  sleep: "sleep",
  weather: "weather",
  light: "light",
  activity: "activity"
}

export const durationTypes = {
  daily: "Daily",
  week: "Week",
  monthly: "Monthly"
}

export const weatherTypes = {
  Rainy: "Rainy",
  Sunny: "Sunny",
  Cloudy: "Cloudy",
  Stormy: "Stormy",
  Snowy: "Snowy",
};

export const weatherApiDataTypes = {
  "thunderstorm": weatherTypes.Stormy,
  "drizzle": weatherTypes.Rainy,
  "rain": weatherTypes.Rainy,
  "snow": weatherTypes.Snowy,
  "clear": weatherTypes.Sunny,
  "clouds": weatherTypes.Cloudy,

  "mist": weatherTypes.Cloudy,
  "smoke": weatherTypes.Cloudy,
  "haze": weatherTypes.Cloudy,
  "dust": weatherTypes.Sunny,
  "fog": weatherTypes.Cloudy,
  "sand": weatherTypes.Sunny,
  "ash": weatherTypes.Sunny,
  "squall": weatherTypes.Stormy,
  "tornado": weatherTypes.Stormy,
}

export const weatherActions = {
  Rainy: "Rainfall",
  Sunny: "Sunny",
  Cloudy: "Cloudy",
  Stormy: "Storm",
  Snowy: "Snowfall",
}

export const defaultLocation = {
  latitude: "33.902885",
  longitude: "151.0142862",
  city: "Yagoona",
  state: "New South Wales",
  country: "Australia"
}

export const defaultWeatherData = {
  "coord": {
    "lon": 72.5997,
    "lat": 22.9987
  },
  "weather": [
    {
      "id": 801,
      "main": "Clouds",
      "description": "few clouds",
      "icon": "02d"
    }
  ],
  "base": "stations",
  "main": {
    "temp": 39.02,
    "feels_like": 46.02,
    "temp_min": 39.02,
    "temp_max": 39.02,
    "pressure": 998,
    "humidity": 42
  },
  "visibility": 6000,
  "wind": {
    "speed": 2.57,
    "deg": 270
  },
  "clouds": {
    "all": 20
  }
};

export const isCountryIndia = () => (moment().utcOffset() == 330);
