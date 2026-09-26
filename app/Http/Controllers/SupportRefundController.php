<?php

namespace App\Http\Controllers;

use App\Models\RefundRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupportRefundController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()?->is_support, 403);

        return Inertia::render('support/requests', [
            'requests' => RefundRequest::with('customer')->latest()->limit(50)->get()
                ->map(fn (RefundRequest $refund): array => [
                    'id' => $refund->id,
                    'customer' => $refund->customer->name,
                    'order_reference' => $refund->order_reference,
                    'customer_message' => $refund->customer_message,
                    'verified_facts' => $refund->verified_facts,
                    'ai_extraction' => $refund->ai_extraction,
                    'ai_mode' => $refund->ai_mode,
                    'matched_rule' => $refund->matched_rule,
                    'decision' => $refund->decision,
                    'customer_response' => $refund->customer_response,
                    'audit_notes' => $refund->audit_notes,
                    'created_at' => $refund->created_at?->toIso8601String(),
                ]),
            'counts' => [
                'total' => RefundRequest::count(),
                'approved' => RefundRequest::where('decision', 'Approved')->count(),
                'denied' => RefundRequest::where('decision', 'Denied')->count(),
                'escalated' => RefundRequest::where('decision', 'Escalated')->count(),
            ],
        ]);
    }
}
