<?php

namespace App\Http\Controllers\Utils;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SpotifyController extends Controller
{
    private $clientId;
    private $clientSecret;
    private $redirectUri;

    public function __construct()
    {
        $this->clientId = config('services.spotify.client_id');
        $this->clientSecret = config('services.spotify.client_secret'); 
        $this->redirectUri = config('services.spotify.redirect_uri');
    }

    public function callback(Request $request)
    {
        if ($request->has('error')) {
            return response()->json(['error' => $request->query('error')], 400);
        }

        $code = $request->query('code');

        # Exchange code for token
        $response = Http::asForm()->post('https://accounts.spotify.com/api/token', [
            'grant_type' => 'authorization_code',
            'code' => $code,
            'redirect_uri' => $this->redirectUri,
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
        ]);

        $tokens = $response->json();
        $accessToken = $tokens['access_token'];

        session(['spotify_accessToken' => $accessToken]);
        $this->getUserDetails($accessToken);

        $frontendUrl = env('APP_URL') . '/requiem-pulse?access_token=' . $accessToken;
        return redirect($frontendUrl);
    }

    # Get Spotify User Details Method
    public function getUserDetails($accessToken)
    {
        $url = "https://api.spotify.com/v1/me";

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $accessToken
        ])->get($url);

        $user = $response->json();

        $user_data = [
            'spotifyIsLoggedIn' => true,
            'access_token' => $accessToken,
            'id'    => $user['id'],
            'name'  => $user['display_name'],
            'email' => $user['email'],
            'product' => $user['product'],
            'uri' => $user['uri'],
            'country' => $user['country'],
            'account_link' => $user['href'],
        ];

        session(['spotify_user_data' => $user_data]);

        return $user_data;
    }

    public function getAccessToken(Request $request)
    {
        $user_accesstoken = session('spotify_user_data.access_token');

        echo '<pre>';
        print_r($user_accesstoken);
        echo '<br>';
        echo '</pre>';
        exit;
        if (!$user_accesstoken) {
            return response()->json(['error' => 'No token found'], 404);
        }
        return response()->json([
            'access_token' => $accessToken
        ]);
    }
}
