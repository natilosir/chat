function lg(log){console.log(log)}
function showError(message) {
    $('#toastMessage').text(message);
    $('#errorToast').fadeIn().delay(5000).fadeOut(); 
}
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf"]').attr('content')
    }
});
function fetchChats(chatvalue, username) {
    $.ajax({
        url: `/chats`,
            type: "POST",
            dataType: "json",
            data: {
                receiver: chatvalue,
            },
            success: function(responseData) {
                const messages = responseData;
                const totalMessages = messages.length;
                let messageId = 1; // مقدار اولیه برای messageId

                for (let i = 0; i < totalMessages; i++) {
                    const chatId = messages[i].id;
                    const messageSender = messages[i].sender;
                    const messageText = messages[i].text; 
                    const messageDate = messages[i].created_at ? messages[i].created_at : 'نامشخص'; 
                    let messageClass, status, editButton, iconClass, iconElement;

                    if (messageSender == username) {
                        messageClass = `un1 fu${messageId}`;
                        status = messages[i].status; 
                        editButton = `<div class='ed${messageId} editl' fuid='${chatId}'><i class='fa fa-edit'></i></div>`;

                        iconClass = (status === 0) ? 'fa-check' : (status === 1) ? 'fa-check-circle' : '';
                        iconElement = `<i class='fa fch ${iconClass}'></i>`;
                    } else {
                        messageClass = 'un2';
                        iconElement = "";
                        editButton = "";
                    }

                    $('#tex').append(`
                        <div class='${messageClass}'>
                            <div class='ea'>${messageText}</div>
                            <div class='date'>${messageDate}${editButton}</div>
                            ${iconElement}
                        </div>
                    `).animate(5000);

                    messageId++;
                }

                $(".load").hide(999);
                $("#cab").slideDown();
                $('body').animate({ scrollTop: $(window).height() }, 1200);

                for (let o = 1; o < messageId; o++) {
                    $(`.ed${o}`).click(function() {
                        const editText = $(`.fu${o} .ea`).text();
                        const fuid = $(`.ed${o}`).attr("fuid");
                        $('#dff').val(editText).attr({ edid: o, fuid: fuid });
                        $(".edif").slideDown(999);
                        $('.se i').addClass("fa-commenting").removeClass("fa-send");
                    });
                }
            },
            error: function(xhr) {
                lg(xhr);
                showError(xhr ? xhr.responseJSON.errors.receiver : 'کاربر را انتخاب کنید' || 'خطای ناشناخته');
            }
        });
}
$(document).ready(function() {
        LastChat = $('meta[name="LastChat"]').attr('content')
        const username = $('meta[name="username"]').attr('content')

    
    $('.register-button').click(function() {
        var userNewChat = $('.username-input').val();
        if (!userNewChat) {
            showError('لطفاً نام کاربری را وارد کنید.');
            return;
        }
        $('.register-button').prop('disabled', true);

        $.post('/CreateChat', { username: userNewChat }, function(response) {
            LastChat = response.hash; 
            $('.item-list').append(`<li chat="${LastChat}">${userNewChat} 🖊</li>`).animate(5000);
            $('meta[name="LastChat"]').attr('content', LastChat);
            $('.username-input').val('');
            $('.register-button').prop('disabled', false);
            $('.dropdown-menu').slideToggle(999); 
            $(".load").fadeIn(999);
            $("#cab").slideUp();
            $('#tex').empty();
            fetchChats(LastChat, username);
        }).fail(function(xhr) {
            console.log(xhr); 
            var errorMessage = 'خطایی در ارسال درخواست پیش آمد.';
            if (xhr.responseJSON && xhr.responseJSON.error) {
                errorMessage = xhr.responseJSON.error;
            }
            showError(errorMessage);
            $('.register-button').prop('disabled', false);
        });
    });

   
    $('ul.item-list li').click(function() {
        var chatValue = $(this).attr('chat');

        if (chatValue === LastChat) {
            $('.menu-toggle').removeClass('menu-class');
            showError('در همین چت هستید');
            $('.dropdown-menu').slideToggle(999); 
            $(".load").fadeOut(999);
        } else {
            LastChat = chatValue; 
            $('meta[name="LastChat"]').attr('content', chatValue);
            $('.dropdown-menu').slideToggle(999); 
            $(".load").fadeIn(999);
            $("#cab").slideUp();
            $('#tex').empty();
            fetchChats(LastChat, username);
        }
    });
   
    if(LastChat){
        fetchChats(LastChat, username);
    }else{
        showError('از منو، نام کاربری شخص مورد نظر را وارد کرده و وارد چت بشوید');
        $(".load").fadeOut(999);
    }


$(document).on('keypress',function(q) {
    if(q.key == "Enter") {
        $('.se').click();
    }
});

$(".se").on("click", function() {
    const messageText = $('#dff').val();

    if (messageText !== "") {

        const now = new Date();
        const currentTime = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

        const messageContainer = $(`
            <div class='un1'>
                <div class='ea'>${messageText}</div>
                <div class='date'>${currentTime}
                    <div class='ed editl' fuid='${messageText}'><i class='fa fa-edit'></i></div>
                </div>
                <i class='fa fch fa-clock-o'></i>
            </div>
        `);

        $('#tex').append(messageContainer).animate(5000);
        
        $.post("/send", {
            receiver: LastChat,
            text: messageText,
        })
        .done(function() {
            $(".fch").removeClass("fa-clock-o").addClass("fa-check");
        })
        .fail(function() {
            $(".fch").addClass("fa-clock-o").removeClass("fa-check");
        });

        $('#dff').val("");
        $(".edif").slideUp(999);
        $('#results #tex').slideDown(3000);
        
        $('html, body').animate({ scrollTop: $(document).height() }, 1500);
        $('.se i').removeClass("fa-commenting").addClass("fa-send");
    }
});

$(window).scroll(function() {
    if ($(window).scrollTop() < $(document).height() - $(window).height() - 200) {
        $(".downs").fadeIn(999);
    } else {
        $(".downs").fadeOut(999);
    }
});

$(".downs").click(function() {
    $('html, body').animate({ scrollTop: $(document).height() }, 1500);
});

$('.menu-toggle').click(function() {
    $('.dropdown-menu').slideToggle(999, function() {
        if ($('.dropdown-menu').is(':visible')) {
            $('.menu-toggle').addClass('menu-class');
            $('.nameprofile').slideDown();
        } else {
            $('.nameprofile').slideUp();
            $('.menu-toggle').removeClass('menu-class');
        }
    });
});

$(".clse").click(function(){
    $('#dff').val("");
    $('#dff').removeAttr("edid fuid");
    $(".edif").slideUp(username);
    $('.se i').removeClass("fa-commenting").addClass("fa-send");

});

setInterval(function() {
if(LastChat){
    $.ajax({
        url: "/load",
        type: "POST",
        dataType: "text",
        data: {
            receiver: LastChat,
        },
        success: function(response) {
            const jsonData = $.parseJSON(response);
            const dataLength = jsonData.length;

            let status = null;

            if (dataLength > 0) {
                status = jsonData[0].status;
            }

            if (dataLength === 0) {
                $(".un1 .fch").removeClass("fa-clock-o fa-check").addClass("fa-check-circle");
            }

            if (status === 5) {
                for (let i = 0; i < dataLength; i++) {
                    const messageDiv = $("<div class='un2'><div class='ea'>" +
                        jsonData[i].text +
                        "</div><div class='date'>" + jsonData[i].date + "</div></div>");

                    $('#tex').append(messageDiv.hide().slideDown(1000));

                    $('html, body').animate({ scrollTop: $(document).height() }, 1500);
                }
            }
        }
    });
}
}, 3700);



});

