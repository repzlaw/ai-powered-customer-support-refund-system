<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $names = ['Amina Bello', 'Daniel Reed', 'Sofia Chen', 'Marcus Hill', 'Priya Patel', 'Noah Brooks', 'Grace Kim', 'Omar Hassan', 'Isabella Cruz', 'Ethan Walker', 'Nia Johnson', 'Leo Martin', 'Fatima Yusuf', 'Lucas Silva', 'Maya Thompson'];
        $items = ['Wireless headphones', 'Ceramic mug', 'Travel backpack', 'Desk lamp', 'Cotton jacket', 'Bluetooth speaker', 'Coffee grinder', 'Notebook set', 'Running shoes', 'Water bottle', 'Phone case', 'Canvas tote', 'Kitchen scale', 'Yoga mat', 'Winter scarf'];

        foreach ($names as $index => $name) {
            $email = 'customer'.($index + 1).'@example.test';
            $user = User::firstOrCreate(
                ['email' => $email],
                ['name' => $name, 'password' => config('services.customer_demo.password')],
            );
            if ($user->wasRecentlyCreated) {
                $user->forceFill(['email_verified_at' => now()])->save();
            }

            $customer = Customer::firstOrCreate(
                ['email' => $email],
                ['name' => $name, 'user_id' => $user->id],
            );
            if ($customer->user_id === null) {
                $customer->update(['user_id' => $user->id]);
            }

            foreach ([1, 2] as $sequence) {
                $days = $sequence === 1 ? [2, 7, 14, 30, 31, 45, 59, 60, 61, 90, 3, 12, 25, 40, 1][$index] : 8 + $index;
                Order::firstOrCreate(
                    ['number' => sprintf('WN-%03d-%d', $index + 1, $sequence)],
                    [
                        'customer_id' => $customer->id,
                        'item_name' => $items[$index],
                        'amount_cents' => $sequence === 1 && $index === 6 ? 50000 : ($sequence === 1 && $index === 7 ? 50001 : 4900 + $index * 1900),
                        'final_sale' => $sequence === 1 && in_array($index, [2, 8, 13], true),
                        'status' => $sequence === 1 && $index === 12 ? 'cancelled' : 'paid',
                        'purchased_at' => now()->subDays($days)->toDateString(),
                    ],
                );
            }
        }

        $support = User::firstOrCreate(
            ['email' => config('services.support_demo.email')],
            [
                'name' => 'Demo Support Reviewer',
                'password' => config('services.support_demo.password'),
                'is_support' => true,
            ],
        );
        if (! $support->hasVerifiedEmail()) {
            $support->forceFill(['email_verified_at' => now()])->save();
        }
    }
}
