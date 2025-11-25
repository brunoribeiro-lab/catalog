<?php

namespace App\Http\Requests;

use App\Rules\Alpha;
use App\Rules\ASCII;
use App\Rules\Email;
use App\Rules\Password;
use App\Rules\UniqueEmail;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;

class RegisterRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $miNM = config('validation.name.min');
        $maNM = config('validation.name.max');

        $miLP = config('validation.password.min');
        $maLP = config('validation.password.max');

        return [
            'email' => [
                'required',
                'max:255',
                function ($attribute, $value, $fail) {
                    if (!app(Email::class)->passes($attribute, $value))
                        return $fail(app(Email::class)->message());
                },
                function ($attribute, $value, $fail) {
                    if (!app(UniqueEmail::class)->passes($attribute, $value))
                        return $fail(app(UniqueEmail::class)->message());
                },
                function ($attribute, $value, $fail) {
                    if (!app(ASCII::class)->passes($attribute, $value))
                        return $fail(app(ASCII::class)->message());
                },
            ],
            'name' => [
                "required",
                "string",
                "min:{$miNM}",
                "max:{$maNM}",
                function ($attribute, $value, $fail) {
                    if (!app(Alpha::class)->passes($attribute, $value))
                        return $fail(app(Alpha::class)->message());
                },
            ],
            'password' => [
                "required",
                "string",
                "min:{$miLP}",
                "max:{$maLP}",
                function ($attribute, $value, $fail) {
                    if (!app(ASCII::class)->passes($attribute, $value))
                        return $fail(app(ASCII::class)->message());
                },
                function ($attribute, $value, $fail) {
                    if (!app(Password::class)->passes($attribute, $value))
                        return $fail(app(Password::class)->message());
                },
            ],
            'password_confirmation' => [
                "required",
                "string",
                "min:{$miLP}",
                "max:{$maLP}",
                "same:password",
                function ($attribute, $value, $fail) {
                    if (!app(ASCII::class)->passes($attribute, $value)) 
                        return $fail(app(ASCII::class)->message());
                },
            ],
        ];
    }

    public function messages()
    {
        return [
            '*.required' => __('error.INPUT_REQUIRED'),
            '*.min' => __('error.INPUT_MIN_LEN'),
            '*.max' => __('error.INPUT_MAX_LEN'),
            '*.string' => __('error.INPUT_INVALID_STRING'),
            'email.unique' => __('error.INVALID_DUPLICATE_EMAIL'),
            '*.same' => __('error.INVALID_PASSWORD_NOT_EQUAL'),
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