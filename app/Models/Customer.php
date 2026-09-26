<?php

namespace App\Models;

use Database\Factories\CustomerFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Collection<int, Order> $orders
 */
#[Fillable(['name', 'email'])]
class Customer extends Model
{
    /** @use HasFactory<CustomerFactory> */
    use HasFactory;

    /** @return HasMany<Order, $this> */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /** @return HasMany<RefundRequest, $this> */
    public function refundRequests(): HasMany
    {
        return $this->hasMany(RefundRequest::class);
    }
}
