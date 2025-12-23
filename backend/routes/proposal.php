<?php

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/missions/{missionId}/proposals', [App\Http\Controllers\ProposalController::class, 'store']);
    Route::get('/proposals/{proposal}', [App\Http\Controllers\ProposalController::class, 'show']);
    Route::get('/missions/{missionId}/proposals', [App\Http\Controllers\ProposalController::class, 'missionProposals']);
    Route::patch('/proposals/{proposalId}/accept', [App\Http\Controllers\ProposalController::class, 'accept']);
    Route::patch('/proposals/{proposalId}/reject', [App\Http\Controllers\ProposalController::class, 'reject']);
});
