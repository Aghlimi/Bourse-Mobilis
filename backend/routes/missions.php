<?php

use App\Http\Controllers\MissionController;
use Illuminate\Support\Facades\Route;
Route::apiResource('missions', MissionController::class)->middleware('auth:sanctum');
Route::patch('/missions/{id}/accept', [MissionController::class, 'accept'])->middleware('auth:sanctum');
Route::patch('/missions/{id}/close', [MissionController::class, 'close'])->middleware('auth:sanctum');
Route::get('/operator/pended', [MissionController::class, 'getPended'])->middleware('auth:sanctum');
Route::patch('/missions/{id}/publish', [MissionController::class, 'publish'])->middleware('auth:sanctum');
Route::get('/missions/my/missions', [MissionController::class, 'myMissions'])->middleware('auth:sanctum');
