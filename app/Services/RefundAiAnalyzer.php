<?php

namespace App\Services;

use App\Ai\Agents\RefundClaimAgent;
use Illuminate\Support\Str;
use Laravel\Ai\Responses\StructuredAgentResponse;
use Throwable;

class RefundAiAnalyzer
{
    /** @return array<string, mixed> */
    public function analyze(string $message): array
    {
        $mode = config('services.refund_ai.mode');
        if ($mode === 'demo') {
            return $this->demoAnalysis($message);
        }
        $provider = config('services.refund_ai.provider');
        $model = config('services.refund_ai.model');
        if (! in_array($mode, ['live', 'openai'], true)
            || ! in_array($provider, ['openai', 'anthropic', 'ollama'], true)
            || ($provider !== 'ollama' && ! config("ai.providers.{$provider}.key"))) {
            return ['error' => 'AI configuration is missing or invalid.'];
        }

        try {
            $response = (new RefundClaimAgent)->prompt(
                json_encode(['customer_message' => $message], JSON_THROW_ON_ERROR),
                provider: $provider,
                model: $model,
                timeout: 45,
            );
            $data = $response instanceof StructuredAgentResponse ? $response->toArray() : null;
            if (! is_array($data) || count($data) !== 3
                || ! array_key_exists('issue_type', $data)
                || ! array_key_exists('conflicting_claims', $data)
                || ! array_key_exists('draft_response', $data)
                || ! in_array($data['issue_type'], ['damaged', 'incorrect', 'unwanted', 'other', 'unknown'], true)
                || ! is_bool($data['conflicting_claims']) || ! is_string($data['draft_response'])
                || Str::length($data['draft_response']) > 300) {
                throw new \UnexpectedValueException('AI response did not match the expected schema.');
            }

            return $data + ['provider' => $provider, 'model' => $response->meta->model ?? $model];
        } catch (Throwable $exception) {
            report($exception);

            return ['error' => 'AI request failed or returned invalid structured output.'];
        }
    }

    /** @return array{issue_type: string, conflicting_claims: bool, draft_response: string, model: string} */
    private function demoAnalysis(string $message): array
    {
        $text = Str::lower($message);
        $damaged = preg_match('/\b(damaged|broken|defective|cracked)\b/', $text) === 1;
        $incorrect = preg_match('/\b(wrong|incorrect|different item)\b/', $text) === 1;
        $unwanted = preg_match('/\b(unwanted|changed my mind|no longer need|return)\b/', $text) === 1;

        return [
            'issue_type' => $damaged ? 'damaged' : ($incorrect ? 'incorrect' : ($unwanted ? 'unwanted' : 'unknown')),
            'conflicting_claims' => ($damaged && preg_match('/\b(not damaged|undamaged)\b/', $text) === 1)
                || ($incorrect && preg_match('/\b(correct item|not wrong)\b/', $text) === 1),
            'draft_response' => 'Thank you for describing your order issue. We will review it under the published refund policy.',
            'model' => 'demo-rules',
        ];
    }
}
