<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class Alpha implements Rule
{
    public function passes($attribute, $value)
    {
        return $this->isValidAlpha($value);
    }

    public function message()
    {
        return __('error.INVALID_ALPHA');
    }

    private function isValidAlpha($value)
    {
        return preg_match('/^[\p{L}\s]+$/u', $value);
    }
}