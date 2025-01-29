<!DOCTYPE html>
<html lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf" content="{{ csrf_token() }}">
    <meta name="username" content="{{ $user->hash }}">
    <meta name="LastChat" content="{{ $lastChat }}">
    <title>CHAT</title>
    <link href="gab.css?<?php echo rand(999, 99899); ?>" type="text/css" rel="stylesheet">
    <script src="jquery.js"></script>
    <script src="front.js?<?php echo rand(999, 99999); ?>"></script>
    <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <div class="ent"></div>
    <div id="cab" style="display:none">
    <div class="downs"><i class='fa fa-angle-down'></i></div>
    <div id="results">
    <div id="tex"></div><div class="padd"></div>
    <div class="edif" style="display:none"><i class="fa clse fa-close"></i> درحال ادیت</div>
    <textarea id="dff"></textarea>
    <label for="dff"><div class="se"><i class='fa fa-send'></i></div></label>
    </div></div>
    <div class="menu-toggle">☰</div>
    <div class="dropdown-menu">

        <div class="nameprofile" style="display: none">{{ $user->name }} - {{ $user->username }}</div>

        <div class="register-card">
            <button class="register-button">ثبت</button>
            <input type="text" placeholder="نام کاربری" class="username-input">
        </div>
        <ul class="item-list">
            @foreach($chats as $chat)
            <li chat="{{ $chat["hash"] }}">{{ $chat["username"] }} 🖊</li>
            @endforeach
        </ul>
        <form id="logout-form" action="{{ route('logout') }}" method="POST">
            {{ csrf_field() }}
            <button id="logout-button" class="logout-button">خروج</button>
        </form>
    </div>
    <div class='load'>
    <div class='circle'></div>
    <div class='circle'></div>
    <div class='circle'></div>
    <div class='circle'></div>
    <div class='circle'></div>
    
    </div>

    <div class="toast" id="errorToast">
        <div class="toast-header">
            <strong class="mr-auto">خطا</strong>
        </div>
        <div class="toast-body" id="toastMessage">
        </div>
    </div>