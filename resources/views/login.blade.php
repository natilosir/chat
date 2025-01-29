<!DOCTYPE html>
<html lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ورود / ثبت نام</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <script src="jquery.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.bundle.min.js"></script>

<style>
    @font-face {
        font-family: IRANSans;
        font-style: normal;
        font-weight: 400;
        src: url(litle.ttf) format("truetype");
    }
    body {
        font-family: 'IRANSans', sans-serif;
        background-color: #f4f4f4;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
    }
    .container {
        background: #fff;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        width: 350px;
        text-align: center;
    }
    h2 {
        color: #6f42c1;
        margin-bottom: 20px;
        font-size: 24px;
    }
    input[type="username"], input[type="password"], input[type="text"] {
        width: 100%;
        padding: 12px;
        margin: 10px 0;
        border: 1px solid #6f42c1;
        border-radius: 5px;
        transition: border-color 0.3s;
    }
    input[type="username"]:focus, input[type="password"]:focus, input[type="text"]:focus {
        border-color: #5a34a1;
        outline: none;
    }
    button {
        width: 100%;
        padding: 12px;
        background-color: #6f42c1;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s;
    }
    button:disabled, button:disabled:hover {
        background-color: #a59aba;
        color: #cec8cd;
        cursor: not-allowed;
        opacity: 1;
        transition: none;
    }
    button:hover {
        background-color: #5a34a1;
    }
    .toggle {
        margin-top: 15px;
        padding: 12px;
        color: #6f42c1;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    .toggle:hover {
        cursor: pointer;
        text-decoration: underline;
    }
</style>
</head>
<body>

<div class="container">
    <h2 id="formTitle">ورود</h2>
    <form id="authForm">
        <input type="text" id="name" placeholder="نام"  style="display: none;">
        <input type="text" id="username" placeholder="نام کاربری" >
        <input type="password" id="password" placeholder="رمز عبور" >
        <button type="submit">ورود</button>
    </form>
    <div class="toggle">
        <span id="toggleText">ثبت نام</span>
    </div>
</div>

<div class="toast" id="errorToast" style="position: absolute; top: 20px; right: 20px; z-index: 1050;" data-autohide="true" data-delay="5000">
    <div class="toast-header bg-danger text-white text-right">
        <strong class="mr-auto text-right">خطا</strong>
    </div>
    <div class="toast-body" id="toastMessage">
    </div>
</div>

<script>
    $(document).ready(function () {
        let isLogin = true; 

        $('.toggle').on('click', function () {
            isLogin = !isLogin; 
            $('#formTitle').text(isLogin ? 'ورود' : 'ثبت نام'); 
            $('#authForm button').text(isLogin ? 'ورود' : 'ثبت نام'); 
            $('#toggleText').text(isLogin ? 'ثبت نام' : 'ورود'); 
            $('#authForm').trigger('reset'); 

            if (isLogin) {
                $('#name').hide();
            } else {
                $('#name').show();
            }
        });

        $('#authForm').on('submit', function (e) {
            e.preventDefault();

            const name = $('#name').val();
            const username = $('#username').val();
            const password = $('#password').val();
            const url = isLogin ? '/login' : '/register';

            let hasTrue = true;

            if (!isLogin && name.trim() === '') {
                $('#toastMessage').text('تکمیل گزینه نام الزامی است');
                $('#errorToast').toast('show');
                hasTrue = false;
            } else if (username.trim() === '') {
                $('#toastMessage').text('تکمیل گزینه نام کاربری الزامی است');
                $('#errorToast').toast('show');
                hasTrue = false;
            }

            else if (password.trim() === '') {
                $('#toastMessage').text('تکمیل گزینه رمزعبور الزامی است');
                $('#errorToast').toast('show');
                hasTrue = false;
            }

    if (hasTrue) {
        $('button[type="submit"]').prop('disabled', true);

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $.ajax({
                        url: url,
                        method: 'POST',
                        data: {
                            name: isLogin ? null : name || null, // ارسال نام فقط در حالت ثبت‌نام
                            username : username,
                            password: password
                        },
                        success: function (response) {
                            $('#toastMessage').text(isLogin ? response.user.name + " عزیز خوش آمدید" : 'ثبت نام موفق' || 'خطای ناشناخته');
                            $('.toast-header').removeClass('bg-danger').addClass('bg-success');
                            $('.mr-auto').text('پیام');
                            $('#errorToast').toast('show');

                            if (response.token) {
                                localStorage.setItem('token', response.token);
                            }

                            window.location.href = '/';
                        },
                        error: function (xhr) {
                            $('button[type="submit"]').prop('disabled', false);
                                console.error('خطا:', xhr.responseJSON);

                                // بررسی status
                                if (xhr.responseJSON.status === "2") {
                                    $('#toastMessage').text('رمز عبور یا نام کاربری اشتباه است');
                                } else if (xhr.responseJSON.errors) {
                                    // اگر خطاهای خاص وجود دارد، پیام‌ها را دونه دونه نمایش دهیم
                                    let errorMessages = [];

                                    // پیمایش در خطاها و افزودن پیام‌ها به آرایه
                                    for (const [field, messages] of Object.entries(xhr.responseJSON.errors)) {
                                        messages.forEach(message => {
                                            errorMessages.push(message);
                                        });
                                    }

                                    // نمایش پیام‌ها به صورت دونه دونه
                                    if (errorMessages.length > 0) {
                                        $('#toastMessage').html(''); // پاک کردن محتوای قبلی
                                        errorMessages.forEach(msg => {
                                            $('#toastMessage').append(`<div>${msg}</div>`); // افزودن هر پیام به toast
                                        });
                                    }
                                } else {
                                    $('#toastMessage').text(xhr.responseJSON.message || 'خطای ناشناخته');
                                }

                                $('#errorToast').toast('show');
                            }
                    });
    }
        });

            

            $.ajax({
                url: '/check',
                method: 'GET',
                success: function (response) {
                    $('#toastMessage').text(response.name + " عزیز خوش آمدید");
                    $('.toast-header').removeClass('bg-danger').addClass('bg-success');
                    $('.mr-auto').text('پیام');
                    $('#errorToast').toast('show'); 
                    window.location.href = '/';

                                },
                error: function (xhr) {
                    console.error('کاربر لاگین نیست:', xhr.responseJSON);
                }
            });
        

    });
</script>


</body>
</html>