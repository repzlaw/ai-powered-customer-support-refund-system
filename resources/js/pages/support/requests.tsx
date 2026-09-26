import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { home } from '@/routes';

type Refund = {
    id: number;
    customer: string;
    order_reference: string;
    customer_message: string;
    verified_facts: Record<string, unknown>;
    ai_extraction: Record<string, unknown> | null;
    ai_mode: string;
    matched_rule: string;
    decision: string;
    customer_response: string;
    audit_notes: Record<string, unknown>;
    created_at: string;
};
type Counts = {
    total: number;
    approved: number;
    denied: number;
    escalated: number;
};

export default function SupportRequests({
    requests,
    counts,
}: {
    requests: Refund[];
    counts: Counts;
}) {
    const [selectedId, setSelectedId] = useState<number | null>(
        requests[0]?.id ?? null,
    );
    const selected = requests.find((request) => request.id === selectedId);
    return (
        <>
            <Head title="Support dashboard" />
            <div className="min-h-screen bg-slate-950 text-slate-100">
                <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
                    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                        <div>
                            <div className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase">
                                Customer Support Refund System
                            </div>
                            <h1 className="mt-2 text-2xl font-semibold">
                                Refund decisions
                            </h1>
                        </div>
                        <Link
                            href={home()}
                            className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
                        >
                            Customer view →
                        </Link>
                    </header>
                    <div className="grid gap-3 py-8 sm:grid-cols-4">
                        {(
                            [
                                ['Total', counts.total],
                                ['Approved', counts.approved],
                                ['Denied', counts.denied],
                                ['Escalated', counts.escalated],
                            ] as const
                        ).map(([label, count]) => (
                            <div
                                key={label}
                                className="rounded-xl border border-white/10 bg-slate-900 p-5"
                            >
                                <div className="text-sm text-slate-400">
                                    {label}
                                </div>
                                <div className="mt-2 text-3xl font-semibold">
                                    {count}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                        <section className="overflow-hidden rounded-xl border border-white/10 bg-slate-900">
                            <div className="border-b border-white/10 px-5 py-4 font-semibold">
                                Recent requests
                            </div>
                            {requests.length === 0 ? (
                                <div className="p-8 text-sm text-slate-400">
                                    No requests yet. Submit one in the customer
                                    view.
                                </div>
                            ) : (
                                <div className="max-h-[70vh] overflow-auto">
                                    {requests.map((request) => (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedId(request.id)
                                            }
                                            key={request.id}
                                            className={`flex w-full justify-between gap-3 border-b border-white/5 px-5 py-4 text-left hover:bg-white/5 ${selectedId === request.id ? 'bg-cyan-400/10' : ''}`}
                                        >
                                            <span>
                                                <span className="block font-medium">
                                                    {request.customer}
                                                </span>
                                                <span className="mt-1 block text-xs text-slate-400">
                                                    {request.order_reference} ·{' '}
                                                    {new Date(
                                                        request.created_at,
                                                    ).toLocaleString()}
                                                </span>
                                            </span>
                                            <span
                                                className={`text-xs font-semibold ${request.decision === 'Approved' ? 'text-emerald-300' : request.decision === 'Denied' ? 'text-rose-300' : 'text-amber-300'}`}
                                            >
                                                {request.decision}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </section>
                        <section className="rounded-xl border border-white/10 bg-slate-900 p-6">
                            {selected ? (
                                <div className="space-y-6">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <div className="text-xs tracking-widest text-slate-400 uppercase">
                                                Request #{selected.id}
                                            </div>
                                            <h2 className="mt-2 text-2xl font-semibold">
                                                {selected.customer}
                                            </h2>
                                        </div>
                                        <span className="rounded-full border border-white/20 px-3 py-1 text-sm">
                                            {selected.decision}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-xs tracking-widest text-slate-500 uppercase">
                                            Customer claim
                                        </div>
                                        <p className="mt-2 text-sm leading-6 whitespace-pre-wrap">
                                            {selected.customer_message}
                                        </p>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <div className="text-xs tracking-widest text-slate-500 uppercase">
                                                Verified order facts
                                            </div>
                                            <pre className="mt-2 overflow-auto rounded-lg bg-slate-950 p-3 text-xs leading-5 text-slate-300">
                                                {JSON.stringify(
                                                    selected.verified_facts,
                                                    null,
                                                    2,
                                                )}
                                            </pre>
                                        </div>
                                        <div>
                                            <div className="text-xs tracking-widest text-slate-500 uppercase">
                                                AI extraction ·{' '}
                                                {selected.ai_mode}
                                            </div>
                                            <pre className="mt-2 overflow-auto rounded-lg bg-slate-950 p-3 text-xs leading-5 text-slate-300">
                                                {JSON.stringify(
                                                    selected.ai_extraction,
                                                    null,
                                                    2,
                                                )}
                                            </pre>
                                        </div>
                                    </div>
                                    <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/5 p-4">
                                        <div className="text-xs tracking-widest text-cyan-300 uppercase">
                                            Deterministic rule ·{' '}
                                            {selected.matched_rule}
                                        </div>
                                        <p className="mt-2 text-sm leading-6">
                                            {typeof selected.audit_notes
                                                .reason === 'string'
                                                ? selected.audit_notes.reason
                                                : 'No reason recorded.'}
                                        </p>
                                    </div>
                                    <div>
                                        <div className="text-xs tracking-widest text-slate-500 uppercase">
                                            Customer response
                                        </div>
                                        <p className="mt-2 text-sm leading-6">
                                            {selected.customer_response}
                                        </p>
                                    </div>
                                    <div>
                                        <div className="text-xs tracking-widest text-slate-500 uppercase">
                                            Audit notes
                                        </div>
                                        <pre className="mt-2 overflow-auto rounded-lg bg-slate-950 p-3 text-xs leading-5 text-slate-300">
                                            {JSON.stringify(
                                                selected.audit_notes,
                                                null,
                                                2,
                                            )}
                                        </pre>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-slate-400">
                                    Select a request to inspect the decision.
                                </p>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}
