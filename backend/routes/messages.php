<?php
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/missions/{missionId}/messages', [App\Http\Controllers\MessageController::class, 'store']);
    Route::get('/missions/{missionId}/messages', [App\Http\Controllers\MessageController::class, 'show']);
});
