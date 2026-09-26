<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Order;
use App\Models\RefundRequest;
use App\Services\ProcessRefundRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RefundRequestController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('refunds/create', [
            'customers' => Customer::with(['orders' => fn ($query) => $query->orderByDesc('purchased_at')])
                ->orderBy('name')->get()->map(fn (Customer $customer): array => [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'email' => $customer->email,
                    'orders' => $customer->orders->map(fn (Order $order): array => [
                        'number' => $order->number,
                        'item_name' => $order->item_name,
                        'amount_cents' => $order->amount_cents,
                        'final_sale' => $order->final_sale,
                        'status' => $order->status,
                        'purchased_at' => $order->purchased_at->toDateString(),
                    ]),
                ]),
            'aiMode' => config('services.refund_ai.mode'),
        ]);
    }

    public function store(Request $request, ProcessRefundRequest $processor): RedirectResponse
    {
        $validated = $request->validate([
            'customer_id' => ['required', 'integer', 'exists:customers,id'],
            'order_reference' => ['required', 'string', 'max:50'],
            'message' => ['required', 'string', 'min:10', 'max:2000'],
        ]);
        $customer = Customer::query()->findOrFail((int) $validated['customer_id']);
        $refund = $processor->handle($customer, trim($validated['order_reference']), $validated['message']);

        return redirect()->route('refunds.show', $refund->public_token);
    }

    public function show(string $token): Response
    {
        $refund = RefundRequest::where('public_token', $token)->firstOrFail();

        return Inertia::render('refunds/show', [
            'refund' => $refund->only(['order_reference', 'decision', 'customer_response', 'matched_rule', 'created_at']),
            'aiMode' => $refund->ai_mode,
        ]);
    }
}
