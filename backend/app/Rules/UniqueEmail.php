<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use App\Models\User;

class UniqueEmail implements Rule
{

    protected $ignoreId;

    public function __construct($ignoreId = null)
    {
        $this->ignoreId = $ignoreId;
    }

    public function passes($attribute, $value)
    {
        return !User::query()
            ->where('email', $value)
            ->where(function ($query) {
                if ($this->ignoreId) 
                    $query->where('id', '!=', $this->ignoreId);
            })
            ->exists();
    }

    public function message()
    {
        return __('error.INVALID_DUPLICATE_EMAIL');
    }
}