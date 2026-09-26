# Refund policy (version 1.0)

This policy governs decisions in the Customer Support Refund System. An **Approved** status means approval by the application workflow only. No payment provider is connected and no money moves. Customers authenticate before viewing their own orders or submitting a request.

## Rule priority

Rules are evaluated in this order. The first match wins.

| Priority | Condition                                                                              | Result    | Why                                                                                     |
| -------- | -------------------------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------- |
| 1        | Order cannot be verified for the signed-in customer                                    | Escalated | Do not decide from customer-supplied order details.                                     |
| 2        | Earlier request exists for the same order                                              | Escalated | Prevent automatic repeat approval; reviewer checks the history.                         |
| 3        | Request contains instructions to override the process                                  | Escalated | Customer text is data, never an instruction source.                                     |
| 4        | AI service fails or structured output is invalid                                       | Escalated | An uninterpretable request cannot be auto-approved or auto-denied.                      |
| 5        | Description contains conflicting claims                                                | Escalated | Reviewer asks for clarification.                                                        |
| 5a       | Description mentions damage or a wrong item but AI classifies it as an ordinary return | Escalated | A model misclassification cannot turn a possible product issue into automatic approval. |
| 6        | Verified order is not paid                                                             | Denied    | No settled payment exists to refund.                                                    |
| 7        | Verified purchase date is in the future                                                | Escalated | Order data needs correction.                                                            |
| 8        | Claimed damaged or incorrect item, reported more than 60 days after purchase           | Denied    | Issue reporting window expired.                                                         |
| 9        | Claimed damaged or incorrect item, within 60 days                                      | Escalated | Reviewer verifies evidence; this includes final-sale items and high-value orders.       |
| 10       | Ordinary request for a final-sale item                                                 | Denied    | Final-sale items cannot be returned for change of mind.                                 |
| 11       | Ordinary request above $500.00                                                         | Escalated | Reviewer handles high-value refunds. Exactly $500.00 is not above the threshold.        |
| 12       | Ordinary request more than 30 days after purchase                                      | Denied    | Standard return window expired. Day 30 remains eligible.                                |
| 13       | Reason is unclear                                                                      | Escalated | Reviewer asks for a clearer reason.                                                     |
| 14       | Otherwise                                                                              | Approved  | Paid, standard, non-final-sale order within 30 days and at most $500.                   |

The damaged final-sale case is deliberately **Escalated** within 60 days: final-sale status does not suppress a possible damaged-goods exception, but an unverified customer claim cannot be auto-approved. After 60 days it is **Denied** unless a human reviewer handles an exception outside this automated workflow. A high-value ordinary final-sale request is **Denied** because the final-sale rule precedes the amount rule.

The LLM may classify the customer claim, identify conflicting claims, and offer a private draft acknowledgement. It does not receive decision authority. The application validates its structured fields, applies this rule order to database facts, and sends a deterministic customer response. The private draft is visible only on the support dashboard. Suspicious override phrases are also checked directly in Laravel so model behavior cannot bypass that safeguard.
