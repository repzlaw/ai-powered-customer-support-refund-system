<?php

namespace App\Models;

use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $customer_id
 * @property string $number
 * @property string $item_name
 * @property int $amount_cents
 * @property bool $final_sale
 * @property string $status
 * @property Carbon $purchased_at
 */
#[Fillable(['customer_id', 'number', 'item_name', 'amount_cents', 'final_sale', 'status', 'purchased_at'])]
class Order extends Model
{
    /** @use HasFactory<OrderFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return ['final_sale' => 'boolean', 'purchased_at' => 'date'];
    }

    /** @return BelongsTo<Customer, $this> */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
