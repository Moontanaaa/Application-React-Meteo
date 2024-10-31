import { emojis } from "./emojis";

export const getEmojis = (temperature, precipitation, windspeed) => {
    let weather = "";

    // Emoji basé sur la température
    if (temperature < 0) {
        weather += emojis.cold;
    } else if (temperature > 25) {
        weather += emojis.hot;
    }

    // Emoji basé sur les précipitations
    if (precipitation === 0) {
        weather += emojis.sun;
    } else if (precipitation > 3) {
        weather += emojis.rain;
    } else {
        weather += emojis.cloud;
    }

    // Emoji basé sur la vitesse du vent
    if (windspeed > 25) {
        weather += emojis.wind;
    }

    return weather;
};
