<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Utils\SpotifyController;

Route::get('/', function () {
    return response()->json([
        'message' => 'Welcome to the API',
        'status' => 'success'
    ]);
});

Route::get('/spotify/callback', [SpotifyController::class, 'callback']);
Route::get('/spotify/access-token', [SpotifyController::class, 'getAccessToken']);
