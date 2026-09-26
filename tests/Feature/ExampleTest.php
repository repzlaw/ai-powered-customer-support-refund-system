<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_sent_to_login_before_opening_the_customer_page()
    {
        $response = $this->get(route('home'));

        $response->assertRedirect(route('login'));
    }
}
