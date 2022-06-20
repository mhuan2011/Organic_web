<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\PaymentController;
use Faker\Provider\ar_EG\Payment;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('admin/login', function () {
    return view('admin.Auth.login');
});



Route::group(['payment', 'middleware' => ['authToken']], function () {
});

//index
Route::group(['test', 'middleware' => ['authToken']], function () {
    return view('admin.Auth.login');
});

Route::group(['prefix' => 'admin', 'middleware' => ['authToken']], function () {
    Route::get('/dashboard', [AdminController::class, 'index']);
    Route::get('/product', [AdminController::class, 'index']);
    Route::get('/product/add-product', [AdminController::class, 'index']);

    Route::get('/category', [AdminController::class, 'index']);
    Route::get('/discount', [AdminController::class, 'index']);
    Route::get('/order', [AdminController::class, 'index']);
    Route::get('/order/result', [PaymentController::class, 'result']);
});
