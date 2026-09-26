<?php

namespace App\Models;

use Database\Factories\RefundRequestFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $customer_id
 * @property int|null $order_id
 * @property string $order_reference
 * @property string $customer_message
 * @property array<string, mixed> $verified_facts
 * @property array<string, mixed>|null $ai_extraction
 * @property string $ai_mode
 * @property string $matched_rule
 * @property string $decision
 * @property string $customer_response
 * @property array<string, mixed> $audit_notes
 * @property Carbon|null $created_at
 * @property Customer $customer
 */
#[Fillable(['public_token', 'customer_id', 'order_id', 'order_reference', 'customer_message', 'verified_facts', 'ai_extraction', 'ai_mode', 'matched_rule', 'decision', 'customer_response', 'audit_notes'])]
class RefundRequest extends Model
{
    /** @use HasFactory<RefundRequestFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return ['verified_facts' => 'array', 'ai_extraction' => 'array', 'audit_notes' => 'array'];
    }

    /** @return BelongsTo<Customer, $this> */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /** @return BelongsTo<Order, $this> */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
