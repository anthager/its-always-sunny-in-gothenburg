import OpenWeatherMapClient from '../clients/open-weather-map-client'
import WeatherService from './weather-service'

describe('WeatherApiService', () => {
  const setupWeatherApiService = (jestFn: jest.Mock<any, any>): WeatherService => {
    const weatherApiClientMock = ({
      weatherForDay: jestFn,
    } as unknown) as OpenWeatherMapClient
    return new WeatherService(weatherApiClientMock)
  }

  it('should only use the temps of the last 24 hours when the last day contains all 24 hours', async () => {
    const expected = {
      min: 1,
      average: 1,
      max: 1,
      median: 1,
    }
    const dataDay1 = {
      hourly: new Array(24).fill({ temp: 0 }),
    }
    const dataDay2 = {
      hourly: new Array(24).fill({ temp: 1 }),
    }

    const mockedFunction = jest
      .fn()
      .mockReturnValueOnce(Promise.resolve(dataDay1))
      .mockReturnValueOnce(Promise.resolve(dataDay2))
    const weatherApiService = setupWeatherApiService(mockedFunction)
    const actual = await weatherApiService.statisticsForNumberOfDays(1)

    expect(actual).toEqual(expected)
  })

  it('should only use the temps of the last 24 hours when the last day contains only 12 hours', async () => {
    const expected = {
      min: 0,
      average: 0.5,
      max: 1,
      median: 0.5,
    }
    const dataDay1 = {
      hourly: new Array(24).fill({ temp: 0 }),
    }
    const dataDay2 = {
      hourly: new Array(12).fill({ temp: 1 }),
    }

    const mockedFunction = jest
      .fn()
      .mockReturnValueOnce(Promise.resolve(dataDay1))
      .mockReturnValueOnce(Promise.resolve(dataDay2))
    const weatherApiService = setupWeatherApiService(mockedFunction)
    const actual = await weatherApiService.statisticsForNumberOfDays(1)

    expect(actual).toEqual(expected)
  })

  it('should ask the weather client for the earliest date first', async () => {
    const dataDay1 = {
      hourly: [],
    }
    const dataDay2 = {
      hourly: [],
    }

    const mockedFunction = jest
      .fn()
      .mockReturnValueOnce(Promise.resolve(dataDay1))
      .mockReturnValueOnce(Promise.resolve(dataDay2))
    const weatherApiService = setupWeatherApiService(mockedFunction)
    await weatherApiService.statisticsForNumberOfDays(1)

    const { calls } = mockedFunction.mock
    expect(calls.length).toEqual(2)
    expect(calls[0][0]).toBeLessThan(calls[1][0])
  })
})
