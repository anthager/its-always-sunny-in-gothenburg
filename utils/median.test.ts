import { median } from './median'

describe('Median', () => {
  it('should get the median 2 of [2,2]', () => {
    const data = [2, 2]
    const expected = 2
    const actual = median(data)
    expect(actual).toEqual(expected)
  })
  it('should get the median 0 of [2,-2]', () => {
    const data = [2, -2]
    const expected = 0
    const actual = median(data)
    expect(actual).toEqual(expected)
  })
  it('should get the median 0 of [2,-2, 4]', () => {
    const data = [2, -2, 4]
    const expected = 2
    const actual = median(data)
    expect(actual).toEqual(expected)
  })
  it('should get the median 0 of [5,4,3,3]', () => {
    const data = [5, 4, 3, 3]
    const expected = 3.5
    const actual = median(data)
    expect(actual).toEqual(expected)
  })
})
