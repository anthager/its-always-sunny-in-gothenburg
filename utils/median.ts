import _ from 'lodash'

export const median = (numbers: number[]): number => {
  if (numbers.length === 0) {
    return 0
  }
  if (numbers.length === 1) {
    return numbers[1]
  }
  const sorted = _.sortBy(numbers)

  const hasEvenLength = sorted.length % 2 === 0
  const middle = Math.floor(sorted.length / 2)
  if (hasEvenLength) {
    const left = sorted[middle - 1]
    const right = sorted[middle]
    return (left + right) / 2
  }
  return sorted[middle]
}
