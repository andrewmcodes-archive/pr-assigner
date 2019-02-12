import { Context } from 'probot'
import { handlePullRequest } from '../src/handler'

describe('handlePullRequest', () => {
  let event: any
  let context: Context

  beforeEach(async () => {
    event = {
      id: '123',
      name: 'pull_request',
      payload: {
        action: 'opened',
        number: '1',
        user: {
          login: "andrewmcodes"
        },
        pull_request: {
          number: '1',
          title: 'test'
        },
        repository: {
          name: 'auto-assign',
          owner: {
            login: 'andrewmcodes'
          }
        }
      }
    }

    context = new Context(event, {} as any, {} as any)

    context.config = jest.fn().mockImplementation(async () => {
      return {
        addReviewers: true,
        numberOfReviewers: 0,
        reviewers: ['reviewer1', 'reviewer2', 'reviewer3'],
        skipKeywords: ['wip']
      }
    })
    context.log = jest.fn() as any
  })

  test('responds with the error if the configuration file failed to load', async () => {
    try {
      // tslint:disable-next-line:no-empty
      context.config = jest.fn().mockImplementation(async () => { })
      await handlePullRequest(context)
    } catch (error) {
      expect(error).toEqual(new Error('the configuration file failed to load'))
    }
  })

  test('exits the process if pull requests include skip words in the title', async () => {
    const spy = jest.spyOn(context, 'log')

    event.payload.pull_request.title = 'wip test'
    await handlePullRequest(context)

    expect(spy.mock.calls[0][0]).toEqual('skips adding reviewers')
  })

  test('adds reviewers to pull requests if the configuration is enabled', async () => {
    context.config = jest.fn().mockImplementation(async () => {
      return {
        addReviewers: true,
        numberOfReviewers: 0,
        reviewers: ['reviewer1', 'reviewer2', 'reviewer3'],
        skipKeywords: ['wip']
      }
    })

    context.github.pullRequests = {
      // tslint:disable-next-line:no-empty
      createReviewRequest: jest.fn().mockImplementation(async () => { })
    } as any

    const createReviewRequestSpy = jest.spyOn(context.github.pullRequests, 'createReviewRequest')

    await handlePullRequest(context)

    expect(createReviewRequestSpy.mock.calls[0][0].reviewers).toHaveLength(3)
  })

  test('does not add pr creator as assignee', async () => {
    context.config = jest.fn().mockImplementation(async () => {
      return {
        addReviewers: true,
        numberOfReviewers: 2,
        reviewers: ['andrewmcodes', 'reviewer2', 'reviewer3'],
        skipKeywords: ['wip']
      }
    })

    context.github.pullRequests = {
      // tslint:disable-next-line:no-empty
      createReviewRequest: jest.fn().mockImplementation(async () => { })
    } as any

    const createReviewRequestSpy = jest.spyOn(context.github.pullRequests, 'createReviewRequest')

    await handlePullRequest(context)

    expect(createReviewRequestSpy.mock.calls[0][0].reviewers).toHaveLength(2)
    expect(createReviewRequestSpy.mock.calls[0][0].reviewers).not.toEqual('andrewmcodes')
  })

  test('adds reviewers to pull requests if the configuration is enabled', async () => {
    context.config = jest.fn().mockImplementation(async () => {
      return {
        addReviewers: true,
        numberOfReviewers: 0,
        reviewers: ['reviewer1', 'reviewer2', 'reviewer3'],
        skipKeywords: ['wip']
      }
    })

    context.github.pullRequests = {
      // tslint:disable-next-line:no-empty
      createReviewRequest: jest.fn().mockImplementation(async () => { })
    } as any

    const createReviewRequestSpy = jest.spyOn(context.github.pullRequests, 'createReviewRequest')

    await handlePullRequest(context)

    const myReviewers = createReviewRequestSpy.mock.calls[0][0].reviewers
    expect(myReviewers).toHaveLength(3)
    expect(myReviewers[0]).toMatch(/reviewer/)
  })

  test('adds unique reviewers', async () => {
    context.config = jest.fn().mockImplementation(async () => {
      return {
        addReviewers: true,
        numberOfReviewers: 2,
        reviewers: ['reviewer1', 'reviewer2', 'reviewer3'],
        skipKeywords: ['wip']
      }
    })

    context.github.pullRequests = {
      // tslint:disable-next-line:no-empty
      createReviewRequest: jest.fn().mockImplementation(async () => { })
    } as any

    const createReviewRequestSpy = jest.spyOn(context.github.pullRequests, 'createReviewRequest')

    await handlePullRequest(context)

    const myReviewers = createReviewRequestSpy.mock.calls[0][0].reviewers
    expect(myReviewers).toHaveLength(2)
    let reviewerOne = myReviewers[0]
    let reviewerTwo = myReviewers[1]
    expect(reviewerOne).not.toMatch(reviewerTwo)
  })

  test('adds reviewers to pull requests based on number of reviewers', async () => {
    context.config = jest.fn().mockImplementation(async () => {
      return {
        addReviewers: true,
        numberOfReviewers: 2,
        reviewers: ['reviewer1', 'reviewer2', 'reviewer3'],
        skipKeywords: ['wip']
      }
    })

    context.github.pullRequests = {
      // tslint:disable-next-line:no-empty
      createReviewRequest: jest.fn().mockImplementation(async () => { })
    } as any

    const createReviewRequestSpy = jest.spyOn(context.github.pullRequests, 'createReviewRequest')

    await handlePullRequest(context)

    expect(createReviewRequestSpy.mock.calls[0][0].reviewers).toHaveLength(2)
  })

})
