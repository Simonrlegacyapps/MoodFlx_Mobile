export const PHOTO_URL = "https://admin.moodflo.com/";

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
