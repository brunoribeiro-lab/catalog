<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class IngestController extends Controller
{
    public function __invoke(Request $request)
    {
        Log::info('Ingested data', ['data' => $request->all()]);
        return response()->json(['status' => 'success'], 200);

    }
}