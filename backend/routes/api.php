<?php

use App\Http\Controllers\MissionController;
use Illuminate\Support\Facades\Route;

Route::prefix('/')->group(function () {
    require __DIR__ . '/users.php';
    require __DIR__ . '/missions.php';
    require __DIR__ . '/proposal.php';
    require __DIR__ . '/messages.php';
});

