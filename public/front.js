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

                for (let i = 0; i < totalMessages; i++) {
                    const chatId = messages[i].id;
                    const messageSender = messages[i].sender;
                    const messageText = messages[i].text; 
                    const messageDate = messages[i].created_at ? messages[i].created_at : 'نامشخص'; 
                    let messageClass, status, editButton, iconClass, iconElement;

                    if (messageSender == username) {
                        messageClass = `un1 ${chatId}`;
                        status = messages[i].status; 
                        editButton = `<div class='editl' fuid='${chatId}'><i class='fa fa-edit'></i></div>`;

                        let iconClass = '';

                        if (status === 0 || status === 2) {
                            iconClass = 'fa-check';
                        } else if (status === 1) {
                            iconClass = 'fa-check-circle';
                        } else {
                            iconClass = ''; // یا هر مقدار پیش‌فرض دیگری که نیاز دارید
                        }

                        iconElement = `<i class='fa fch ${iconClass}'></i>`;
                    } else {
                        messageClass = `un2 ${chatId}`;
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
                }

                $(".load").hide(999);
                $("#cab").slideDown();
                $('body').animate({ scrollTop: $(window).height() }, 1200);
            },
            error: function(xhr) {
                lg(xhr);
                showError(xhr ? xhr.responseJSON.errors.receiver : 'کاربر را انتخاب کنید' || 'خطای ناشناخته');
            }
        });
}

$(document).on('click', '.editl', function() {
    const editText = $(this).closest('.un1').find('.ea').text();
    const fuid = $(this).closest('.un1').find('.editl').attr('fuid');
    $('#dff').val(editText).attr({ edid: $(this).attr("edid"), fuid: fuid });
    $(".edif").slideDown(999);
    $('.se i').addClass("fa-commenting").removeClass("fa-send");
});

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
        const fuid = $('#dff').attr('fuid');
        if (messageText !== "") {
            const now = new Date();
            const currentTime = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

            if (fuid) {
                // Edit existing message
                existingMessage = $(`.un1.${fuid}`);
                if (existingMessage.length) {
                    existingMessage.find('.ea').text(messageText);
                    existingMessage.find('.date').text(currentTime + " ویرایش شده ")
                        .append(`<div class="editl" fuid="${fuid}"><i class="fa fa-edit"></i></div>`);
                    existingMessage.find('.fch').removeClass("fa-check-circle").removeClass("fa-check").addClass("fa-clock-o");

                    // Send updated message via POST
                    $.post("/edit", {
                        receiver: LastChat,
                        text: messageText,
                        id: fuid // Add ID parameter for editing
                    })
                        .done(function() {
                            $(".fch", existingMessage).removeClass("fa-clock-o").addClass("fa-check");
                        })
                        .fail(function() {
                            $(".fch", existingMessage).addClass("fa-clock-o").removeClass("fa-check");
                        });
                }
            } else {
                const randomId = Math.random().toString(36).substr(2, 9);
                const messageContainer = $(`
    <div class='un1 ${randomId}'>
        <div class='ea'>${messageText}</div>
        <div class='date'>${currentTime} 
            <div class='editl' fuid='${randomId}'><i class='fa fa-edit'></i></div>
        </div>
        <i class='fa fch fa-clock-o'></i>
    </div>
`);

                $('#tex').append(messageContainer).animate({ scrollTop: $('#tex')[0].scrollHeight }, 5000);

                $.post("/send", {
                    receiver: LastChat,
                    text: messageText,
                })
                    .done(function(response) {
                        const messageId = response.id;

                        // Replace randomId with messageId in the class list
                        messageContainer[0].className = messageContainer[0].className.replace(randomId, messageId);

                        // Update fuid attribute
                        messageContainer.find('.editl').attr('fuid', messageId);

                        // Update the check icon
                        $(".fch", messageContainer)
                            .removeClass("fa-clock-o")
                            .addClass("fa-check");
                    })
                    .fail(function() {
                        // Handle failure
                        $(".fch", messageContainer)
                            .addClass("fa-clock-o")
                            .removeClass("fa-check");
                    });
            }

            $('#dff').val("").removeAttr('fuid');
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



setInterval(() => {
    if (LastChat) {
        $.ajax({
            url: "/load",
            type: "POST",
            dataType: "text",
            data: { receiver: LastChat },
            success: (response) => {
                const jsonData = $.parseJSON(response);
                const dataLength = jsonData.length;
                const status = dataLength > 0 ? jsonData[0].status : null;

                if (dataLength === 0) {
                    $(".un1 .fch").removeClass("fa-clock-o fa-check").addClass("fa-check-circle");
                }

                if (status === 5 || status === 2) {
                    jsonData.forEach((message) => {
                        const messageDiv = $(
                            `<div class='un2 ${message.id}'>
                            <div class='ea'>${message.text}</div>
                            <div class='date'>${message.date}</div>
                         </div>`
                        );
                        if(status === 5){
                            $('#tex').append(messageDiv.hide().slideDown(1000));
                        }
                        if(status ===2){
                            const now = new Date();
                            const currentTime = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

                            existingMessage = $(`.un2.${message.id}`);
                            if (existingMessage.length) {
                                existingMessage.find('.ea').text(message.text);
                                existingMessage.find('.date').text(" ویرایش شده "+currentTime);
                            }
                        }
$('html, body').animate({ scrollTop: $(document).height() }, 1500);
                    });
                }
            }
        });
    }
}, 3700);


});

