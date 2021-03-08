import { WeatherApiResponse } from '../types/weather'

type FetchClient = (url: string) => Promise<{ json: () => Promise<any> }>

class OpenWeatherMapClient {
  private readonly apiKey: string

  constructor(private readonly fetchClient: FetchClient) {
    const apiKey = process.env.WEATHER_API_KEY
    if (!apiKey) {
      throw new Error('api key is not provided')
    }
    this.apiKey = apiKey
  }

  public async weatherForDay(
    day: number,
    options = { lat: 57.707161, lon: 11.96679, units: 'metric' }
  ): Promise<WeatherApiResponse> {
    const json = this.fetchClient(
      `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${options.lat}&lon=${options.lon}&dt=${day}&units=${options.units}&appid=${this.apiKey}`
    ).then((raw) => raw.json())
    return json
  }
}

export default OpenWeatherMapClient
