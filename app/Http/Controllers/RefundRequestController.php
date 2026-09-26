<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\RefundRequest;
use App\Services\ProcessRefundRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RefundRequestController extends Controller
{
    public function create(Request $request): RedirectResponse|Response
    {
        if ($request->user()->is_support) {
            return redirect()->route('support.requests');
        }

        $customer = $request->user()->customer;
        if ($customer === null) {
            abort(403);
        }

        return Inertia::render('refunds/create', [
            'customer' => [
                'name' => $customer->name,
                'email' => $customer->email,
                'orders' => $customer->orders()->orderByDesc('purchased_at')->get()->map(fn (Order $order): array => [
                    'number' => $order->number,
                    'item_name' => $order->item_name,
                    'amount_cents' => $order->amount_cents,
                    'final_sale' => $order->final_sale,
                    'status' => $order->status,
                    'purchased_at' => $order->purchased_at->toDateString(),
                ]),
            ],
            'aiMode' => config('services.refund_ai.mode'),
        ]);
    }

    public function store(Request $request, ProcessRefundRequest $processor): RedirectResponse
    {
        abort_if($request->user()->is_support, 403);
        $customer = $request->user()->customer;
        if ($customer === null) {
            abort(403);
        }

        $validated = $request->validate([
            'order_reference' => ['required', 'string', 'max:50'],
            'message' => ['required', 'string', 'min:10', 'max:2000'],
        ]);
        $refund = $processor->handle($customer, trim($validated['order_reference']), $validated['message']);

        return redirect()->route('refunds.show', $refund->public_token);
    }

    public function show(Request $request, string $token): Response
    {
        $refund = RefundRequest::where('public_token', $token)
            ->whereHas('customer', fn ($query) => $query->where('user_id', $request->user()->id))
            ->firstOrFail();

        return Inertia::render('refunds/show', [
            'refund' => $refund->only(['order_reference', 'decision', 'customer_response', 'matched_rule', 'created_at']),
            'aiMode' => $refund->ai_mode,
        ]);
    }
}
