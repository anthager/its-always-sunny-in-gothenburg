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

const TABLE_CELL = 'px-3 capitalize'

const Index = ({ max, min, average, median }: IndexProps): JSX.Element => {
  return (
    <div className="flex flex-col items-center w-full h-screen text-gray-200 bg-blue-500">
      <div className="flex pt-20 text-8xl space-x-8">
        <p className="font-medium">Göteborg</p>
      </div>
      <p className="pt-4 text-xl">Temperatures the last 4 days:</p>
      <table className="text-center text-xl">
        <thead>
          <tr>
            <th className={TABLE_CELL}>min</th>
            <th className={TABLE_CELL}>max</th>
            <th className={TABLE_CELL}>average</th>
            <th className={TABLE_CELL}>median</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{min}°c</td>
            <td>{max}°c</td>
            <td>{average}°c</td>
            <td>{median}°c</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Index
