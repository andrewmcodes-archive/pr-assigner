# PR Assigner

This GitHub App assigns reviewers to PR's based on settings defined in `.github/pr_reviews.yml`.

## Usage

1. **[Install the app](https://github.com/apps/pr-assigner)**.
2. Create a `.github/pr_reviews.yml` file in your repository. Changes to this file on the default branch will be synced to GitHub.

```yaml
addReviewers: true
reviewers:
  - reviewerA
  - reviewerB
  - reviewerC
numberOfReviewers: 0
skipKeywords:
  - wip
```
