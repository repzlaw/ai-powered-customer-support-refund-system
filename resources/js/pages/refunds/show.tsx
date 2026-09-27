import { Head, Link } from '@inertiajs/react';
import { home } from '@/routes';

type Refund = {
    order_reference: string;
    decision: 'Approved' | 'Denied' | 'Escalated';
    customer_response: string;
    matched_rule: string;
    created_at: string;
};

export default function RefundResult({
    refund,
    aiMode,
    aiProvider,
}: {
    refund: Refund;
    aiMode: string;
    aiProvider: string;
}) {
    const accent =
        refund.decision === 'Approved'
            ? 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10'
            : refund.decision === 'Denied'
              ? 'text-rose-300 border-rose-400/30 bg-rose-400/10'
              : 'text-amber-300 border-amber-400/30 bg-amber-400/10';
    return (
        <>
            <Head title={`Request ${refund.decision}`} />
            <div className="flex min-h-screen items-center justify-center bg-slate-950 px-5 py-12 text-slate-100">
                <main className="w-full max-w-xl rounded-2xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
                    <div className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase">
                        Customer Support Refund System
                    </div>
                    <span
                        className={`mt-8 inline-block rounded-full border px-4 py-2 text-sm font-semibold ${accent}`}
                    >
                        {refund.decision}
                    </span>
                    <h1 className="mt-5 text-3xl font-semibold">
                        Request for {refund.order_reference}
                    </h1>
                    <p className="mt-4 leading-7 text-slate-300">
                        {refund.customer_response}
                    </p>
                    <div className="mt-7 rounded-lg bg-slate-950 p-4 text-sm text-slate-400">
                        <div>
                            Matched rule:{' '}
                            <span className="font-mono text-slate-200">
                                {refund.matched_rule}
                            </span>
                        </div>
                        <div className="mt-2">
                            Analysis mode:{' '}
                            {aiMode === 'demo'
                                ? 'demo classifier (no model call)'
                                : refund.matched_rule === 'AI_UNAVAILABLE'
                                  ? `${aiProvider} request failed; sent for support review`
                                  : `${aiProvider} model analysis`}
                        </div>
                    </div>
                    <Link
                        href={home()}
                        className="mt-8 inline-block rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
                    >
                        Start another request
                    </Link>
                </main>
            </div>
        </>
    );
}
