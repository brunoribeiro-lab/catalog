<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Passport\Passport;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Passport::enablePasswordGrant();
        Passport::tokensExpireIn(now()->addSeconds((int) env('TOKEN_TTL', 60) * 60));
        Passport::refreshTokensExpireIn(now()->addDays((int) env('REFRESH_TTL_DAYS', 30)));
        Passport::personalAccessTokensExpireIn(now()->addSeconds((int) env('TOKEN_TTL', 60) * 60));
    }
}
