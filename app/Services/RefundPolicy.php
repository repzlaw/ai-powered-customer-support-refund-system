<?php

namespace App\Services;

use App\Models\Order;

class RefundPolicy
{
    /** @param array<string, mixed> $analysis
     * @return array{decision: string, rule: string, reason: string}
     */
    public function decide(?Order $order, array $analysis, bool $duplicate, string $message): array
    {
        if ($order === null) {
            return $this->result('Escalated', 'ORDER_NOT_FOUND', 'We could not verify that order for the selected customer.');
        }
        if ($duplicate) {
            return $this->result('Escalated', 'DUPLICATE_REQUEST', 'A refund request already exists for this order.');
        }
        if (preg_match('/\b(ignore (all |previous |the )?(instructions|rules|policy)|override (the )?(rules|policy)|bypass (the )?policy|system prompt|developer message|approve (this |my )?request regardless|jailbreak)\b/i', $message)) {
            return $this->result('Escalated', 'SUSPICIOUS_INSTRUCTIONS', 'The request contains instructions aimed at changing the review process.');
        }
        if (isset($analysis['error'])) {
            return $this->result('Escalated', 'AI_UNAVAILABLE', 'The request could not be reliably interpreted.');
        }
        if ($analysis['conflicting_claims']) {
            return $this->result('Escalated', 'CONFLICTING_CLAIMS', 'The description contains conflicting claims.');
        }
        if (preg_match('/\b(damaged|broken|defective|cracked|wrong item|incorrect item)\b/i', $message)
            && ! in_array($analysis['issue_type'], ['damaged', 'incorrect'], true)) {
            return $this->result('Escalated', 'ISSUE_CLASSIFICATION_CONFLICT', 'The description and AI classification disagree about a possible product issue.');
        }
        if ($order->status !== 'paid') {
            return $this->result('Denied', 'ORDER_NOT_PAID', 'Only paid orders are eligible for a refund.');
        }
        $days = $order->purchased_at->startOfDay()->diffInDays(now()->startOfDay(), false);
        if ($days < 0) {
            return $this->result('Escalated', 'INVALID_ORDER_DATE', 'The order date could not be verified.');
        }
        if (in_array($analysis['issue_type'], ['damaged', 'incorrect'], true)) {
            if ($days > 60) {
                return $this->result('Denied', 'ISSUE_WINDOW_EXPIRED', 'Damage and wrong-item claims must be reported within 60 days.');
            }

            return $this->result('Escalated', 'ISSUE_NEEDS_EVIDENCE', 'Damage and wrong-item claims require a support reviewer to verify evidence, including final-sale items.');
        }
        if ($order->final_sale) {
            return $this->result('Denied', 'FINAL_SALE', 'Final-sale items are not eligible for an ordinary refund.');
        }
        if ($order->amount_cents > 50000) {
            return $this->result('Escalated', 'HIGH_VALUE', 'Refunds above $500 require support review.');
        }
        if ($days > 30) {
            return $this->result('Denied', 'STANDARD_WINDOW_EXPIRED', 'Ordinary refunds must be requested within 30 days.');
        }
        if ($analysis['issue_type'] === 'unknown') {
            return $this->result('Escalated', 'UNCLEAR_ISSUE', 'The reason for the refund needs clarification.');
        }

        return $this->result('Approved', 'STANDARD_ELIGIBLE', 'The paid, non-final-sale order is within 30 days and does not exceed $500.');
    }

    /** @return array{decision: string, rule: string, reason: string} */
    private function result(string $decision, string $rule, string $reason): array
    {
        return compact('decision', 'rule', 'reason');
    }
}
