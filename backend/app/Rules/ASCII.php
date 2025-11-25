<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class ASCII implements Rule
{
    public function passes($attribute, $value)
    {
        return $this->isValidASCII($value);
    }

    public function message()
    {
        return __('error.INVALID_ASCII');
    }

    private function isValidASCII($value)
    {
        return preg_match('/^[\x20-\x7E\xC0-\xFF]+$/u', $value);
    }
}