<?php

use App\Http\Controllers\IngestController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::group(['prefix' => 'authentication'], function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

Route::group(['prefix' => 'v1'], function () {
    Route::post('/ingest', IngestController::class);
});