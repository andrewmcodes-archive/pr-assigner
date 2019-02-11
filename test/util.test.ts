import { chooseUsers, includesSkipKeywords } from '../src/util'

describe('chooseUsers', () => {
  test('returns the reviewer list without the owner', () => {
    const owner = 'owner'
    const reviewers = ['owner','reviewer1','reviewer2', 'reviewer3']
    const numberOfReviewers = 0

    const list = chooseUsers(owner, reviewers, numberOfReviewers)

    expect(list).toEqual(['reviewer1','reviewer2', 'reviewer3'])
  })

  test('returns the only other reviewer', () => {
    const owner = 'owner'
    const reviewers = ['owner','reviewer1']
    const numberOfReviewers = 1

    const list = chooseUsers(owner, reviewers, numberOfReviewers)

    expect(list).toEqual(['reviewer1'])
  })

  test('returns the reviewer list if the number of reviewers is setted', () => {
    const owner = 'owner'
    const reviewers = ['owner','reviewer1','reviewer2', 'reviewer3']
    const numberOfReviewers = 2

    const list = chooseUsers(owner, reviewers, numberOfReviewers)

    expect(list.length).toEqual(2)
  })

  test('returns the only owner if if the number of reviewers is one', () => {
    const owner = 'owner'
    const reviewers = ['owner']
    const numberOfReviewers = 0

    const list = chooseUsers(owner, reviewers, numberOfReviewers)

    expect(list.length).toEqual(1)
  })
})

describe('includesSkipKeywords', () => {
  test('returns true if the pull request title includes skip word', () => {
    const title = 'WIP add a new feature'
    const skipWords = ['wip']

    const contains = includesSkipKeywords(title, skipWords)

    expect(contains).toEqual(true)
  })

  test('returns false if the pull request title does not include skip word', () => {
    const title = 'add a new feature'
    const skipWords = ['wip']

    const contains = includesSkipKeywords(title, skipWords)

    expect(contains).toEqual(false)
  })
})
