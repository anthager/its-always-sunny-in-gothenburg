import { GetServerSideProps } from 'next'
import OpenWeatherMapClient from '../clients/open-weather-map-client'
import WeatherService from '../services/weather-service'

export const getServerSideProps: GetServerSideProps = async () => {
  const weatherApiClient = new OpenWeatherMapClient(fetch)
  const weatherApiService = new WeatherService(weatherApiClient)
  const fourDaysMetrics = await weatherApiService.statisticsForNumberOfDays(4)

  return {
    props: fourDaysMetrics,
  }
}

interface IndexProps {
  max: number
  min: number
  average: number
  median: number
}

const TITLE_CELL = 'capitalize font-semibold'

const Index = ({ max, min, average, median }: IndexProps): JSX.Element => {
  return (
    <div className="flex flex-col items-center w-full h-screen text-gray-300 bg-blue-900">
      <div className="flex pt-20 text-5xl space-x-8 sm:text-8xl">
        <p className="font-medium">Göteborg</p>
      </div>
      <p className="text-md pt-4 font-light sm:text-lg">Temperatures the last 4 days:</p>
      <div className="grid grid-cols-4 grid-rows-2 justify-items-center text-lg sm:text-xl">
        <p className={TITLE_CELL}>average</p>
        <p className={TITLE_CELL}>min</p>
        <p className={TITLE_CELL}>max</p>
        <p className={TITLE_CELL}>median</p>
        <p>{average}°c</p>
        <p>{min}°c</p>
        <p>{max}°c</p>
        <p>{median}°c</p>
      </div>
    </div>
  )
}

export default Index
