import { EnumPullReqReviewDecision } from '../interfaces'

export const mockReviewers = [
  {
    created: 1711754093953,
    updated: 1711754093953,
    type: 'self_assigned',
    latest_review_id: 111,
    review_decision: 'changereq' as EnumPullReqReviewDecision,
    sha: '73b10cca5b9f5121822f31b81346954e5f1dce99',
    reviewer: {
      id: 5,
      uid: 'default',
      display_name: 'default',
      email: 'default@harness.io',
      type: 'user',
      created: 1700943243392,
      updated: 1700943243392
    },
    added_by: {
      id: 5,
      uid: 'default',
      display_name: 'default',
      email: 'default@harness.io',
      type: 'user',
      created: 1700943243392,
      updated: 1700943243392
    }
  }
]