<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\RefundRequest;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<RefundRequest>
 */
class RefundRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'public_token' => (string) Str::uuid(),
            'customer_id' => Customer::factory(),
            'order_id' => null,
            'order_reference' => 'UNKNOWN-'.fake()->unique()->numerify('######'),
            'customer_message' => 'I cannot locate the order details for my return.',
            'verified_facts' => ['verified' => false],
            'ai_extraction' => ['issue_type' => 'unknown', 'conflicting_claims' => false, 'draft_response' => 'We will review your request.', 'model' => 'demo-rules'],
            'ai_mode' => 'demo',
            'matched_rule' => 'ORDER_NOT_FOUND',
            'decision' => 'Escalated',
            'customer_response' => 'Your request needs a support review.',
            'audit_notes' => ['policy_version' => '1.0', 'reason' => 'Order could not be verified.'],
        ];
    }
}
