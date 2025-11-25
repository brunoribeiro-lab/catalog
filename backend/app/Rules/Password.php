<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class Password implements Rule
{
    public function passes($attribute, $value)
    {
        return $this->isValidPassword($value);
    }

    public function message()
    {
        return __('error.INVALID_PASSWORD');
    }

    private function isValidPassword($value)
    {
        return preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/', $value);
    }
}