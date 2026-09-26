<?php

use App\Http\Controllers\RefundRequestController;
use App\Http\Controllers\SupportRefundController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [RefundRequestController::class, 'create'])->name('home');
    Route::post('/refund-requests', [RefundRequestController::class, 'store'])->middleware('throttle:10,1')->name('refunds.store');
    Route::get('/refund-requests/{token}', [RefundRequestController::class, 'show'])->name('refunds.show');
    Route::get('dashboard', fn (Request $request) => $request->user()->is_support
        ? redirect()->route('support.requests')
        : redirect()->route('home'))->name('dashboard');
    Route::get('support/requests', [SupportRefundController::class, 'index'])->name('support.requests');
});

require __DIR__.'/settings.php';
