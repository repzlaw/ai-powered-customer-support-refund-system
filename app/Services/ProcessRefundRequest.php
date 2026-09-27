<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Order;
use App\Models\RefundRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ProcessRefundRequest
{
    public function __construct(private RefundAiAnalyzer $analyzer, private RefundPolicy $policy) {}

    public function handle(Customer $customer, string $orderReference, string $message): RefundRequest
    {
        $order = Order::whereBelongsTo($customer)->where('number', $orderReference)->first();
        $previousRequest = $order === null ? null : RefundRequest::where('order_id', $order->id)->latest('id')->first();
        if ($previousRequest !== null && $previousRequest->decision !== 'Denied') {
            throw ValidationException::withMessages([
                'order_reference' => 'A refund has already been requested for this order.',
            ]);
        }
        $duplicate = $previousRequest !== null;
        $facts = $order ? [
            'number' => $order->number,
            'item_name' => $order->item_name,
            'amount_cents' => $order->amount_cents,
            'final_sale' => $order->final_sale,
            'status' => $order->status,
            'purchased_at' => $order->purchased_at->toDateString(),
        ] : ['order_reference' => $orderReference, 'verified' => false];
        $analysis = $this->analyzer->analyze($message);
        $decision = $this->policy->decide($order, $analysis, $duplicate, $message);
        $response = match ($decision['decision']) {
            'Approved' => 'Your request meets the refund policy and has been approved.',
            'Denied' => 'Your refund request was denied. '.$decision['reason'],
            default => 'Your refund request needs a support review. '.$decision['reason'],
        };

        return RefundRequest::create([
            'public_token' => (string) Str::uuid(),
            'customer_id' => $customer->id,
            'order_id' => $order?->id,
            'order_reference' => $orderReference,
            'customer_message' => $message,
            'verified_facts' => $facts,
            'ai_extraction' => $analysis,
            'ai_mode' => config('services.refund_ai.mode'),
            'matched_rule' => $decision['rule'],
            'decision' => $decision['decision'],
            'customer_response' => $response,
            'audit_notes' => [
                'policy_version' => '1.0',
                'reason' => $decision['reason'],
                'duplicate_order_request' => $duplicate,
                'ai_error' => $analysis['error'] ?? null,
                'ai_provider' => config('services.refund_ai.mode') === 'demo' ? 'demo' : config('services.refund_ai.provider'),
                'ai_model' => $analysis['model'] ?? config('services.refund_ai.model'),
                'manual_review_required' => $decision['decision'] === 'Escalated',
            ],
        ]);
    }
}
