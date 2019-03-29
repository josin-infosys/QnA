function validator() {
    var error=5;
    var fname = $("#fname").val();
    var uname = $("#uname").val();
    var email = $("#email").val();
    var pass = $("#pass").val();
    var pass2 = $("#pass2").val();


    fname = fname.trim();
    var regex1 = fname.search("^[a-zA-Z][a-zA-Z ]*$");
    if (fname === "") {
        $("#formAlert").html("Enter a name");
        warner();
        return error;
    }
    else if (regex1 === -1) {
        $("#formAlert").html("Entered name is invalid");
        warner();
        return error;
    }
    error--;


    uname = uname.trim();
    var regex2 = uname.search("^[a-zA-Z][a-zA-Z0-9]{3,15}$");
    if (uname === "") {
        $("#formAlert").html("Enter a username");
        warner();
        return error;
    }
    else if (uname.length < 4) {
        $("#formAlert").html("Username is too short");
        warner();
        return error;
    }
    else if (uname.length > 16) {
        $("#formAlert").html("Username is too long");
        warner();
        return error;
    }
    else if (regex2 === -1) {
        $("#formAlert").html("Entered username is invalid");
        warner();
        return error;
    }
    error--;


    email = email.trim();
    var regex3 = email.search("^[a-zA-Z][a-zA-Z0-9_\.]*\@[a-zA-Z]+\.[a-zA-Z]{2,3}$");
    if (email === "") {
        $("#formAlert").html("Enter an email address");
        warner();
        return error;
    }
    else if (regex3 === -1) {
        $("#formAlert").html("Entered email is invalid");
        warner();
        return error;
    }
    error--;


    pass = pass.trim();
    var regex4 = pass.search("^[a-zA-Z0-9\@#\$\%\&\*]{8,16}$");
    if (pass === "") {
        $("#formAlert").html("Enter a password");
        warner();
        return error;
    }
    else if (regex4 === -1) {
        $("#formAlert").html("Entered password is invalid");
        warner();
        return error;
    }
    error--;


    pass2 = pass2.trim();
    if (pass2 !== pass) {
        $("#formAlert").html("Passwords don't match");
        warner();
        return error;
    }
    error--;


    return error;
}

function warner() {
    $("#formAlert").css("visibility","visible");
    var faScroll = $("#formAlert").offset().top;
    $(window).scrollTop(faScroll);
}


function regAct() {
    $("#formAlert").css("visibility","hidden");

    var fname = $("#fname").val();
    var uname = $("#uname").val();
    var email = $("#email").val();
    var pass = $("#pass").val();
    var error = validator();
    if (error === 0){
        $.post("/register/otp/",
        {
            fname: fname,
            uname: uname,
            pwd: pass,
            email: email
        },
        function (data) {
            if (data === "uname") {
                $("#formAlert").html("Username already exists.");
                warner();
            }
            else if (data === "email") {
                $("#formAlert").html("Email address already exists.");
                warner();
            }
            else {
                console.log(data);
                $("#rejax").html(data);
            }
        }
        );
    }
}



function regFin() {
    $("#formAlert").css("visibility","hidden");

    var otp = $("#otpid").val();
    $.post("/register/action/",
    {
        otp: otp
    },
    function (data) {
        if (data === "pass") {
            window.location.href = "/";
        }
        else if (data === "test") {
            alert(data);
        }
        else {
            $("#formAlert").html("OTP does not match. Try again.");
            warner();
        }
    }
    );
}