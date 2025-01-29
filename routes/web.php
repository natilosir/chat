<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\IndexController;
use App\Http\Controllers\ChatController;

Route::get('/login', 'AuthController@showLoginForm')->name('login');
Route::post('/login', 'AuthController@login');
Route::post('/logout', 'AuthController@logout')->name('logout');

Route::get('/register', 'AuthController@showRegistrationForm')->name('register');
Route::post('/register', 'AuthController@register');
Route::get('/check', 'AuthController@check');

Route::group(['middleware' => 'auth'], function () {
    Route::get('/', 'IndexController@index');
    Route::post('/CreateChat', 'IndexController@CreateNewChat');
    Route::post('/chats', 'ChatController@show');
    Route::post('/send', 'ChatController@send');
    Route::post('/load', 'ChatController@load');
});