<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/users', [UserController::class, 'store']);
Route::get('/users/{user}', [UserController::class, 'show'])
            ->middleware('auth:sanctum');
Route::get('/users', [UserController::class, 'index'])
            ->middleware('auth:sanctum');
Route::post('/login', [UserController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout'])
            ->middleware('auth:sanctum');
