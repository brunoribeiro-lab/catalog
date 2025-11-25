<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Services\AuthService;
use Exception;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function login(LoginRequest $request)
    {
        try {
            $result = $this->authService->login([
                'login' => $request->input('login'),
                'password' => $request->input('password'),
                'ip' => $request->ip()
            ]);

            $user = $result['user'];
            $access = $result['access'];

            return response()->json([
                'uid' => $user->uid,
                'name' => $user->name,
                'email' => $user->email,
                'cc_verified' => $user->email_verified_at ? true : false,
                'access_token' => $access['access_token'],
                'refresh_token' => $access['refresh_token'] ?? null,
                'expires_in' => $access['expires_in'] ?? (int) env('TOKEN_TTL', 60) * 60,
                'token_type' => $access['token_type'] ?? 'Bearer'
            ], 200);

        } catch (Exception $e) {
            $msgKey = $e->getMessage();

            $status = 401;
            if ($msgKey === 'error.ACCOUNT_NON_VERIFIED')
                $status = 403;

            if ($msgKey === 'error.OAUTH_ERROR')
                $status = 500;

            return response()->json([
                'error' => [
                    'message' => __($msgKey),
                ]
            ], $status);
        }
    }

    public function register(RegisterRequest $request)
    {
        try {
            $result = $this->authService->register([
                'email' => $request->input('email'),
                'name' => $request->input('name'),
                'password' => $request->input('password'),
            ]);

            return response()->json([
                'title' => __($result['title_key']),
                'message' => __($result['message_key']),
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'error' => [
                    'message' => __('error.REGISTRATION_FAILED'),
                ]
            ], 500);
        }
    }
}
