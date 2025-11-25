<?php

namespace App\Http\Requests;

use App\Rules\ASCII;
use App\Rules\Password;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $miLP = config('validation.password.min');
        $maLP = config('validation.password.max');

        return [
            'login' => [
                'required',
                'email',
                'max:150'
            ],
            'password' => [
                "required",
                "string",
                "min:{$miLP}",
                "max:{$maLP}",
                function ($attribute, $value, $fail) {
                    if (!app(ASCII::class)->passes($attribute, $value)) {
                        return $fail(app(ASCII::class)->message());
                    }
                },
                function ($attribute, $value, $fail) {
                    if (!app(Password::class)->passes($attribute, $value)) {
                        return $fail(app(Password::class)->message());
                    }
                },
            ]
        ];
    }

    public function messages()
    {
        return [
            '*.required' => __('error.INPUT_REQUIRED'),
            '*.min' => __('error.INPUT_MIN_LEN'),
            '*.max' => __('error.INPUT_MAX_LEN'),
            'password.required' => __('error.INPUT_REQUIRED'),
            'password.string' => __('error.INPUT_INVALID_STRING'),
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        $response = response()->json([
            'error' => [
                'message' => __('error.VERIFICATION_FAILED'),
                'details' => $validator->errors(),
            ]
        ], 422);

        throw new ValidationException($validator, $response);
    }

}