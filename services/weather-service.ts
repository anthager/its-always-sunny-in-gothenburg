import dayjs from 'dayjs'
import _ from 'lodash'
import OpenWeatherMapClient from '../clients/open-weather-map-client'
import { WeatherApiResponse } from '../types/weather'
import { median } from '../utils/median'

interface PeriodStatistics {
  max: number
  min: number
  average: number
  median: number
}

class WeatherService {
  constructor(private readonly openWeatherMapClient: OpenWeatherMapClient) {}

  public async statisticsForNumberOfDays(numberOfDays: number): Promise<PeriodStatistics> {
    const days = WeatherService.timestampsInterval(numberOfDays + 1)
    const apiResponses = await Promise.all(
      days.map((day) => {
        // js uses milliseconds for unix time while the api uses seconds
        const dayInSeconds = day / 1000
        return this.openWeatherMapClient.weatherForDay(dayInSeconds)
      })
    )
    const allTemps = WeatherService.apiResponseToFlatTempsPerHour(apiResponses, numberOfDays)
    const precision = 1
    const max = _.round(_.max(allTemps) || 0, precision)
    const min = _.round(_.min(allTemps) || 0, precision)
    const average = _.round(_.mean(allTemps), precision)
    const med = _.round(median(allTemps), precision)
    return { max, min, average, median: med }
  }

  /**
   *
   * @param days the number of days back that should be included in the interval
   * @param naturalOrder should the interval be returned in a chronological order, defaults to true
   * @param start the day in which the interval start. Should be given as unix milliseconds, defaults to today
   */
  private static timestampsInterval(
    days: number,
    naturalOrder = true,
    start = dayjs().startOf('day')
  ): number[] {
    const interval = []
    let current = start
    for (let i = 0; i < days; i += 1) {
      interval.push(+current)
      current = current.subtract(1, 'day')
    }
    return naturalOrder ? _.reverse(interval) : interval
  }

  private static apiResponseToFlatTempsPerHour(
    responses: WeatherApiResponse[],
    numberOfDays: number,
    even24Hours = true
  ): number[] {
    const tempsByDay = responses.map((response) => response.hourly.map((hourly) => hourly.temp))
    const allTemps = _.flattenDeep(tempsByDay)
    if (even24Hours) {
      const hoursInADay = 24
      const excessDaysInFirstDay = allTemps.length - hoursInADay * numberOfDays
      allTemps.splice(0, excessDaysInFirstDay)
    }
    return allTemps
  }
}

export default WeatherService
