<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Support\Facades\Log;
use Exception;

class AuthService
{
    
    /**
     * Handles user authentication and generates an OAuth access token.
     *
     * @param array $data ['login', 'password', 'ip']
     * @return array
     * @throws Exception
     */
    public function login(array $data): array
    {
        $user = User::where('email', $data['login'])->first();

        if (!$user) {
            throw new Exception('error.AUTHENTICATION_FAILED');
        }

        if (!Hash::check($data['password'], $user->password)) {
            throw new Exception('error.AUTHENTICATION_FAILED');
        }

        if (env('LOGIN_NEED_VERIFICATION') && !$user->email_verified_at) {
            throw new Exception('error.ACCOUNT_NON_VERIFIED');
        }

        // Kick out previous tokens
        $user->tokens()->delete();

        // Create OAuth token request (password grant)
        $payload = [
            'grant_type' => 'password',
            'client_id' => env('PASSPORT_PASSWORD_CLIENT_ID'),
            'client_secret' => env('PASSPORT_PASSWORD_CLIENT_SECRET'),
            'username' => $data['login'],
            'password' => $data['password'],
            'scope' => '',
        ];

        $proxyReq = HttpRequest::create('/oauth/token', 'POST', $payload, [], [], [
            'HTTP_ACCEPT' => 'application/json',
            'CONTENT_TYPE' => 'application/x-www-form-urlencoded',
        ]);

        $oauth = app()->handle($proxyReq);

        if ($oauth->getStatusCode() >= 400) {
            Log::error('OAuth Error: ' . $oauth->getContent(), ['payload' => $payload]);
            throw new Exception('error.OAUTH_ERROR');
        }

        $access = json_decode($oauth->getContent(), true);

        // Clear login attempts cache (use forget)
        $key = 'login_attempts_' . ($data['ip'] ?? request()->ip());
        Cache::forget($key);

        return [
            'user' => $user,
            'access' => $access,
        ];
    }

    /**
     * Registers a new user and optionally triggers email verification logic.
     *
     * @param array $data ['email', 'name', 'password']
     * @return array Message translation keys
     */
    public function register(array $data): array
    {
        $user = User::create([
            'email' => $data['email'],
            'name' => $data['name'],
            'password' => Hash::make($data['password']),
        ]);

        // Default message keys
        $titleKey = 'messages.registration_success_title';
        $messageKey = 'messages.registration_success_message_no_verify';

        if (env('LOGIN_NEED_VERIFICATION')) {
            $messageKey = 'messages.registration_success_message_verify';
            $verificationUrl = URL::temporarySignedRoute(
                'verification.verify',
                now()->addMinutes(60),
                ['user' => $user->id]
            );

            // Enviar email com queue (implementar depois)
            // Mail::to($user->email)->queue(new \App\Mail\VerifyEmail($user, $verificationUrl));
            // Para fins de debug:
            Log::info('Verification url generated for user', ['user_id' => $user->id, 'url' => $verificationUrl]);
        }

        return [
            'title_key' => $titleKey,
            'message_key' => $messageKey,
        ];
    }

}
