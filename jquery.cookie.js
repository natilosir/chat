/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setTime(+t + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}

		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));


















pid=1;
un1=$.cookie("your");
un2=$.cookie("they");
if(un1 && un2){
$.ajax({
    url: "api.php",
    type: "POST",
    dataType: "text",
    data:{
        un1: un1,
        un2: un2,
    },success: function(inputDataFromServer) {
            json = $.parseJSON(inputDataFromServer);
            f=json.length;
        for (i=0;i<f;++i)
        {idchat=json[i].id;
         u1=json[i].un1;
if(u1==un1){
    he='un1 fu'+pid;
    b1=json[i].s;
    edi="<div class='ed"+pid+" editl' fuid='"+idchat+"'><i class='fa fa-edit'></i></div>"
if(b1==0){jv='fa-check';}
if(b1==2){jv='fa-check-circle';}
fc="<i class='fa fch "+jv+"'></i>";}
else{he='un2';fc="";edi="";}

$('#tex').append( "<div class='"+he+"'><div class='ea'>"+json[i].text+"</div><div class='date'>"+json[i].date+edi+
    "</div>"+fc+"</div>").animate(5000);pid=pid+1;
}
        $(".load").hide(999);
        $("#cab").show();
$('body').animate({ scrollTop: $(window).height() }, 1200);


$(document).ready(function(){ 

for(let o=0;o<pid;o++){

$(".ed"+o).click(function(){
eid=  $(".fu"+o+" .ea").text();
fuid=  $(".ed"+o).attr("fuid");
$('#dff').val(eid).attr({edid:o,fuid:fuid});
$(".edif").slideDown(999);
$('.se i').addClass("fa-commenting").removeClass("fa-send");

});

}; 
});



}
});

$(document).ready(function(){ 

$(document).on('keypress',function(q) {
    if(q.key == "Enter") {
        $('.sae').click();
    }
});


$(".se").on("click", function(){
texta=$('#dff').val();
fud=$('#dff').attr("fuid");
eud=$('#dff').attr("edid");

if(eud>0){
$(".fu"+eud+" .ea").text(texta);
$(".fu"+eud+" i").addClass("fa-clock-o").removeClass("fa-check fa-check-circle");

}else if(texta !== ""){pid=pid+1;idchat=Math.abs(idchat)+1;
    $(document).ready(function(){ 

$(".ed"+pid).click(function(){
eid=  $(".fu"+pid+" .ea").text();
fuid=  $(".ed"+pid).attr("fuid");
$('#dff').val(eid).attr({edid:pid,fuid:fuid});
$(".edif").slideDown(999);
$('.se i').addClass("fa-commenting").removeClass("fa-send");

});
});
$('#tex').append(
"<div class='un1 fu"+pid+"'><div class='ea'>"+
texta+"</div><div class='date'>همین الان<div class='ed"+pid+" editl' fuid='"+
idchat+"'><i class='fa fa-edit'></i></div></div><i class='fa fch fa-clock-o rh"+pid+"'></i></div></div>" ).animate(5000);}
$('#dff').val("");
$(".edif").slideUp(999);
$('#results #tex').slideDown(3000);

$.post("api.php",
    {
        un1: un1,
        un2: un2,
        text: texta,
        fud: fud,
    },)
    .done(function(){
        $("#dff").removeAttr("edid fuid");
        $(".fu"+eud+" i").removeClass("fa-clock-o").addClass("fa-check");
        $(".rh"+pid).removeClass("fa-clock-o").addClass("fa-check");})
    .fail(function(){
        $(".fu"+eud+" i").addClass("fa-clock-o").removeClass("fa-check fa-check-circle");
        $(".rh"+pid).removeClass("fa-clock-o").addClass("fa-remove");});
$('body').animate({ scrollTop: $(window).height() }, 1200);
$('.se i').removeClass("fa-commenting").addClass("fa-send");
});
});

setInterval(function() {
$.ajax({
    url: "api.php",
    type: "POST",
    dataType: "text",
    data:{
        un1: un1,
        un2: un2,
        upd: 'yes',
    },success: function(inputDataFromServer) {
            json = $.parseJSON(inputDataFromServer);
            jj=json.length;
            jv=json[0].stat;
            if(jv==0){
$(".un1 .fch").removeClass("fa-clock-o fa-check").addClass("fa-check-circle");
            }
            if(jv==5){
        for (i=0;i<jj;++i)
        {
        u1=json[i].un1;

if(u1){
$('#tex'). append( "<div class='un2'>"+json[i].text+"<div class='date'>"+json[i].date+"</div></div>").animate(5000);
}

$('body').animate({ scrollTop: $(window).height() }, 1200);
    }}}
});
}, 1700);


}else{
un1 = prompt("Enter your username");
un2 = prompt("Which username do you want to connect to?");
$.cookie("your",un1, { expires: 99 });
$.cookie("they",un2, { expires: 99 });
setTimeout(function(){window.location.reload();},1400);
}

$(document).ready(function(){
    $(window).scroll(function() {
        if ($(window).height()- $(window).scrollTop() > 2000) {
            $(".downs").fadeIn(999);
        } else {
            $(".downs").fadeOut(999);
        }
    });

     
    $(".clse").click(function(){
        $('#dff').val("");
        $('#dff').removeAttr("edid fuid");
        $(".edif").slideUp(999);
        $('.se i').removeClass("fa-commenting").addClass("fa-send");

    });
    $(".downs").click(function(){
$('body').animate({ scrollTop: $(window).height() }, 1200);
    });

});
