<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_id' => Customer::factory(),
            'number' => 'ORD-'.fake()->unique()->numerify('######'),
            'item_name' => fake()->randomElement(['Headphones', 'Desk lamp', 'Travel bag']),
            'amount_cents' => 8900,
            'final_sale' => false,
            'status' => 'paid',
            'purchased_at' => now()->subDays(5)->toDateString(),
        ];
    }
}
