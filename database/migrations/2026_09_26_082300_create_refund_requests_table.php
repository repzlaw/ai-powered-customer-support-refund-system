<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('refund_requests', function (Blueprint $table) {
            $table->id();
            $table->uuid('public_token')->unique();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('order_id')->nullable()->constrained()->nullOnDelete();
            $table->string('order_reference');
            $table->text('customer_message');
            $table->json('verified_facts');
            $table->json('ai_extraction')->nullable();
            $table->string('ai_mode');
            $table->string('matched_rule');
            $table->string('decision');
            $table->text('customer_response');
            $table->json('audit_notes');
            $table->timestamps();
            $table->index(['created_at', 'decision']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('refund_requests');
    }
};
