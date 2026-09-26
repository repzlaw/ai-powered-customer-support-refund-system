import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { login } from '@/routes';
import { store } from '@/routes/refunds';

type Order = {
    number: string;
    item_name: string;
    amount_cents: number;
    final_sale: boolean;
    status: string;
    purchased_at: string;
};
type Customer = { id: number; name: string; email: string; orders: Order[] };

export default function CreateRefund({
    customers,
    aiMode,
}: {
    customers: Customer[];
    aiMode: string;
}) {
    const [customerId, setCustomerId] = useState(
        String(customers[0]?.id ?? ''),
    );
    const [orderReference, setOrderReference] = useState(
        customers[0]?.orders[0]?.number ?? '',
    );
    const customer = customers.find(
        (person) => String(person.id) === customerId,
    );
    const selectedOrder = customer?.orders.find(
        (order) => order.number === orderReference,
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
                            href={login()}
                            className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
                        >
                            Support sign in →
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
                                Select a customer and order, then tell us what
                                happened. Verified order data and published
                                rules determine the decision. AI helps
                                understand your message but cannot override the
                                policy.
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
                            <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm leading-6 text-amber-100/80">
                                <strong>Demo identity only.</strong> Selecting a
                                seeded customer is not authentication. Do not
                                enter real personal or payment information.
                                “Approved” does not transfer money.
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
                                        <label className="block space-y-2">
                                            <span className="text-sm font-medium">
                                                Customer
                                            </span>
                                            <select
                                                name="customer_id"
                                                value={customerId}
                                                onChange={(event) => {
                                                    const id =
                                                        event.target.value;
                                                    setCustomerId(id);
                                                    setOrderReference(
                                                        customers.find(
                                                            (person) =>
                                                                String(
                                                                    person.id,
                                                                ) === id,
                                                        )?.orders[0]?.number ??
                                                            '',
                                                    );
                                                }}
                                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100"
                                            >
                                                <option value="">
                                                    Choose a customer
                                                </option>
                                                {customers.map((person) => (
                                                    <option
                                                        key={person.id}
                                                        value={person.id}
                                                    >
                                                        {person.name} ·{' '}
                                                        {person.email}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.customer_id && (
                                                <span className="text-sm text-rose-400">
                                                    {errors.customer_id}
                                                </span>
                                            )}
                                        </label>
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="order_reference"
                                                className="text-sm font-medium"
                                            >
                                                Order number
                                            </label>
                                            <input
                                                id="order_reference"
                                                name="order_reference"
                                                value={orderReference}
                                                onChange={(event) =>
                                                    setOrderReference(
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Select below or enter an unknown order"
                                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100"
                                            />
                                            {errors.order_reference && (
                                                <div className="text-sm text-rose-400">
                                                    {errors.order_reference}
                                                </div>
                                            )}
                                            <div className="max-h-48 space-y-2 overflow-auto pt-2">
                                                {customer?.orders.map(
                                                    (order) => (
                                                        <button
                                                            type="button"
                                                            key={order.number}
                                                            onClick={() =>
                                                                setOrderReference(
                                                                    order.number,
                                                                )
                                                            }
                                                            className={`flex w-full items-center justify-between rounded-lg border p-3 text-left text-sm ${orderReference === order.number ? 'border-cyan-400 bg-cyan-500/10' : 'border-slate-700 bg-slate-950 hover:border-slate-500'}`}
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
                                                                    {order.final_sale
                                                                        ? ' · final sale'
                                                                        : ''}
                                                                </span>
                                                            </span>
                                                            <span className="font-semibold">
                                                                $
                                                                {(
                                                                    order.amount_cents /
                                                                    100
                                                                ).toFixed(2)}
                                                            </span>
                                                        </button>
                                                    ),
                                                )}
                                            </div>
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
                                            disabled={processing}
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
