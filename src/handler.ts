import { Context } from 'probot'
import { chooseUsers, includesSkipKeywords } from './util'

interface AppConfig {
  addReviewers: boolean,
  addSecondaryReviewers: boolean,
  reviewers: string[],
  numberOfReviewers: number,
  secondaryReviewers: string[],
  numberOfSecondaryReviewers: number,
  skipKeywords?: string[]
}

export async function handlePullRequest (context: Context): Promise<void> {
  let config: AppConfig | null

  config = await context.config<AppConfig | null>('pr_reviews.yml')

  if (!config) {
    throw new Error('the configuration file failed to load')
  }

  const payload = context.payload

  const owner = payload.repository.owner.login
  const title = payload.pull_request.title

  if (config.skipKeywords && includesSkipKeywords(title, config.skipKeywords)) {
    context.log('skips adding reviewers')
    return
  }
  const primaryReviewers = config.reviewers
  const secondaryReviewers = config.secondaryReviewers
  const numPrimaryReviewers = config.numberOfReviewers
  const numSecondaryReviewers = config.numberOfSecondaryReviewers

  const allReviewers:string[] = primaryReviewers.concat(secondaryReviewers)
  const totalNumberOfReviewers = numPrimaryReviewers + numSecondaryReviewers
  const reviewers = chooseUsers(owner, allReviewers, totalNumberOfReviewers)

  let result: any

if (allReviewers && totalNumberOfReviewers > 0) {
    try {
      const params = context.issue({
        reviewers
      })
      result = await context.github.pullRequests.createReviewRequest(params)
      context.log(result)
    } catch (error) {
      context.log(error)
    }
  }
}
