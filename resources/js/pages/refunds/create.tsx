import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { logout } from '@/routes';
import { store } from '@/routes/refunds';

type Order = {
    number: string;
    item_name: string;
    amount_cents: number;
    final_sale: boolean;
    status: string;
    purchased_at: string;
    previous_decision: 'Approved' | 'Denied' | 'Escalated' | null;
};
type Customer = { name: string; email: string; orders: Order[] };

export default function CreateRefund({
    customer,
    aiMode,
}: {
    customer: Customer;
    aiMode: string;
}) {
    const [orderReference, setOrderReference] = useState(
        customer.orders.find(
            (order) =>
                !order.previous_decision ||
                order.previous_decision === 'Denied',
        )?.number ?? '',
    );
    const [orderPickerOpen, setOrderPickerOpen] = useState(false);
    const [orderSearch, setOrderSearch] = useState('');
    const selectedOrder = customer.orders.find(
        (order) => order.number === orderReference,
    );
    const matchingOrders = customer.orders.filter((order) =>
        `${order.item_name} ${order.number}`
            .toLowerCase()
            .includes(orderSearch.trim().toLowerCase()),
    );

    return (
        <>
            <Head title="Request a refund" />
            <div className="min-h-screen bg-slate-950 text-slate-100">
                <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8">
                    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                        <div>
                            <div className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase">
                                Customer support
                            </div>
                            <div className="mt-2 text-lg font-semibold">
                                Customer Support Refund System
                            </div>
                        </div>
                        <Link
                            href={logout()}
                            method="post"
                            as="button"
                            className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
                        >
                            Sign out
                        </Link>
                    </header>
                    <main className="grid gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
                        <section className="space-y-6">
                            <div className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold tracking-widest text-cyan-300 uppercase">
                                Customer request
                            </div>
                            <h1 className="max-w-xl text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
                                Request a refund with clarity.
                            </h1>
                            <p className="max-w-lg text-base leading-7 text-slate-400">
                                Welcome back,
                                <b> {customer.name}.</b>
                                Select one of your orders and tell us what
                                happened. Verified order data and published
                                rules determine the decision. AI helps interpret
                                your message but cannot override the policy.
                            </p>
                            <div className="grid gap-3 sm:grid-cols-3">
                                {[
                                    ['01', 'Select an order'],
                                    ['02', 'Describe the issue'],
                                    ['03', 'Get a decision'],
                                ].map(([number, label]) => (
                                    <div
                                        key={number}
                                        className="rounded-xl border border-white/10 bg-white/5 p-4"
                                    >
                                        <div className="text-sm font-bold text-cyan-400">
                                            {number}
                                        </div>
                                        <div className="mt-2 text-sm text-slate-200">
                                            {label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                        <section className="rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/30 sm:p-8">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-xl font-semibold">
                                    Start a refund request
                                </h2>
                                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                                    {aiMode === 'demo'
                                        ? 'Demo AI mode'
                                        : 'Live AI mode'}
                                </span>
                            </div>
                            <Form {...store.form()} className="mt-7 space-y-6">
                                {({ errors, processing }) => (
                                    <>
                                        <div className="space-y-2">
                                            <label
                                                className="block text-sm font-medium"
                                                htmlFor="order-picker"
                                            >
                                                Your order
                                            </label>
                                            <input
                                                type="hidden"
                                                name="order_reference"
                                                value={orderReference}
                                            />
                                            {errors.order_reference && (
                                                <div className="text-sm text-rose-400">
                                                    {errors.order_reference}
                                                </div>
                                            )}
                                            {customer.orders.length === 0 && (
                                                <p className="rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm text-slate-400">
                                                    No orders are associated
                                                    with this account yet.
                                                </p>
                                            )}
                                            {customer.orders.length > 0 && (
                                                <button
                                                    id="order-picker"
                                                    type="button"
                                                    aria-expanded={
                                                        orderPickerOpen
                                                    }
                                                    aria-controls="order-options"
                                                    onClick={() =>
                                                        setOrderPickerOpen(
                                                            !orderPickerOpen,
                                                        )
                                                    }
                                                    className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-700 bg-slate-950 p-3 text-left text-sm hover:border-cyan-400"
                                                >
                                                    <span>
                                                        <strong className="block">
                                                            {selectedOrder?.item_name ??
                                                                'Select an order'}
                                                        </strong>
                                                        {selectedOrder && (
                                                            <span className="text-xs text-slate-400">
                                                                {
                                                                    selectedOrder.number
                                                                }{' '}
                                                                ·{' '}
                                                                {
                                                                    selectedOrder.purchased_at
                                                                }{' '}
                                                                · $
                                                                {(
                                                                    selectedOrder.amount_cents /
                                                                    100
                                                                ).toFixed(2)}
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span className="shrink-0 text-cyan-300">
                                                        Change ▾
                                                    </span>
                                                </button>
                                            )}
                                            {orderPickerOpen && (
                                                <div
                                                    id="order-options"
                                                    className="space-y-2 rounded-lg border border-slate-700 bg-slate-950 p-3"
                                                >
                                                    <input
                                                        type="search"
                                                        autoFocus
                                                        value={orderSearch}
                                                        onChange={(event) =>
                                                            setOrderSearch(
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                        placeholder="Search item or order number"
                                                        aria-label="Search your orders"
                                                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                                                    />
                                                    <div className="max-h-56 space-y-1 overflow-y-auto">
                                                        {matchingOrders
                                                            .slice(0, 8)
                                                            .map((order) => (
                                                                <button
                                                                    type="button"
                                                                    key={
                                                                        order.number
                                                                    }
                                                                    disabled={
                                                                        order.previous_decision !==
                                                                            null &&
                                                                        order.previous_decision !==
                                                                            'Denied'
                                                                    }
                                                                    onClick={() => {
                                                                        setOrderReference(
                                                                            order.number,
                                                                        );
                                                                        setOrderPickerOpen(
                                                                            false,
                                                                        );
                                                                        setOrderSearch(
                                                                            '',
                                                                        );
                                                                    }}
                                                                    className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-slate-800 focus:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-transparent"
                                                                >
                                                                    <span>
                                                                        <strong className="block">
                                                                            {
                                                                                order.item_name
                                                                            }
                                                                        </strong>
                                                                        <span className="text-xs text-slate-400">
                                                                            {
                                                                                order.number
                                                                            }{' '}
                                                                            ·{' '}
                                                                            {
                                                                                order.purchased_at
                                                                            }
                                                                        </span>
                                                                    </span>
                                                                    {order.previous_decision ? (
                                                                        <span
                                                                            className={`shrink-0 rounded-full border px-2 py-1 text-xs ${order.previous_decision === 'Denied' ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300' : 'border-amber-500/40 bg-amber-500/10 text-amber-300'}`}
                                                                        >
                                                                            {order.previous_decision ===
                                                                            'Denied'
                                                                                ? 'Previously denied · Request review'
                                                                                : 'Refund already requested'}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="shrink-0">
                                                                            $
                                                                            {(
                                                                                order.amount_cents /
                                                                                100
                                                                            ).toFixed(
                                                                                2,
                                                                            )}
                                                                        </span>
                                                                    )}
                                                                </button>
                                                            ))}
                                                        {matchingOrders.length ===
                                                            0 && (
                                                            <p className="px-3 py-2 text-sm text-slate-400">
                                                                No matching
                                                                orders.
                                                            </p>
                                                        )}
                                                    </div>
                                                    {matchingOrders.length >
                                                        8 && (
                                                        <p className="px-3 text-xs text-slate-400">
                                                            Showing 8 of{' '}
                                                            {
                                                                matchingOrders.length
                                                            }{' '}
                                                            matches. Refine your
                                                            search to find
                                                            another order.
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                            {customer.orders.length > 0 &&
                                                !selectedOrder && (
                                                    <p className="text-sm text-slate-400">
                                                        No orders are available
                                                        for a new refund
                                                        request. Only previously
                                                        denied requests can be
                                                        reviewed again.
                                                    </p>
                                                )}
                                        </div>
                                        {selectedOrder && (
                                            <div className="rounded-lg bg-slate-800 px-4 py-3 text-xs text-slate-300">
                                                Verified order status:{' '}
                                                <strong className="text-white">
                                                    {selectedOrder.status}
                                                </strong>
                                            </div>
                                        )}
                                        <label className="block space-y-2">
                                            <span className="text-sm font-medium">
                                                What happened?
                                            </span>
                                            <textarea
                                                name="message"
                                                rows={5}
                                                minLength={10}
                                                maxLength={2000}
                                                placeholder="For example: I changed my mind and would like to return this item."
                                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 placeholder:text-slate-600"
                                            />
                                            {errors.message && (
                                                <span className="text-sm text-rose-400">
                                                    {errors.message}
                                                </span>
                                            )}
                                        </label>
                                        <button
                                            disabled={
                                                processing ||
                                                !selectedOrder ||
                                                (selectedOrder.previous_decision !==
                                                    null &&
                                                    selectedOrder.previous_decision !==
                                                        'Denied')
                                            }
                                            className="w-full rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
                                        >
                                            {processing
                                                ? 'Reviewing request…'
                                                : 'Submit for review →'}
                                        </button>
                                    </>
                                )}
                            </Form>
                            <p className="mt-5 text-xs leading-5 text-slate-500">
                                Standard returns: 30 days. Damaged or incorrect
                                items: report within 60 days for manual review.
                                Final-sale and high-value rules apply.
                            </p>
                        </section>
                    </main>
                </div>
            </div>
        </>
    );
}
