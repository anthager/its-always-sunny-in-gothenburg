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

  /**
   * returns an object containing `min`, `max`, `average` and `median` of temperatures of the last `numberOfDays` (at least 1 day).
   * One day is defined as 24 hours, i.e. if `numberOfDays` is 4, statistics of the last 96 hours are returned
   */
  public async statisticsForNumberOfDays(numberOfDays: number): Promise<PeriodStatistics> {
    if (numberOfDays === 0) {
      throw new Error('must request at least 1 day')
    }
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
   * returns an array with the timestamps of 00:00 each day starting from `start` (defaults to today) going back `days` number of days
   */
  private static timestampsInterval(days: number, start = dayjs().startOf('day')): number[] {
    const interval = []
    let current = start
    for (let i = 0; i < days; i += 1) {
      interval.push(+current)
      current = current.subtract(1, 'day')
    }
    return _.reverse(interval)
  }

  /**
   * returns an array with the temperatures for the last 24 * `numberOfDays` hours given an array of WeatherApiResponses
   */
  private static apiResponseToFlatTempsPerHour(
    responses: WeatherApiResponse[],
    numberOfDays: number
  ): number[] {
    const tempsByDay = responses.map((response) => response.hourly.map((hourly) => hourly.temp))
    const allTemps = _.flattenDeep(tempsByDay)

    const hoursInADay = 24
    const excessDaysInFirstDay = allTemps.length - hoursInADay * numberOfDays
    allTemps.splice(0, excessDaysInFirstDay)
    return allTemps
  }
}

export default WeatherService
