<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class Email implements Rule
{
    public function passes($attribute, $value)
    {
        return $this->isValid($value);
    }

    public function message()
    {
        return __('error.INVALID_EMAIL');
    }

    private function isValid($email)
    {
        $email = trim($email);

        if (!preg_match('/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/', $email)) 
            return false;

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) 
            return false;

        list(, $domain) = explode('@', $email);
        if (!checkdnsrr($domain, 'MX')) 
            return false;
        
        return true;
    }
}