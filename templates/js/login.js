function checker(name,pwd) {
    $.post('/login/action/',
    {
        uname: name,
        pass: pwd
    },
    function (data) {
        if (data === "no") {
            $("#formAlert").html("Login failed. Try again");
            $("#formAlert").css("visibility","visible");
        }
        else {
            window.location.href = "/";
        }
    }
    );
}

function validator() {
    var error = 2;
    var name = $("#uname").val();
    name = name.trim();
    var regEx = name.search("^[a-zA-Z][a-zA-Z0-9]{3,15}$");
    if(regEx === -1)
    {
        $("#formAlert").html("Invalid username");
        $("#formAlert").css("visibility","visible");
        return error;
    }
    else
    {
        error--;
    }

    var pwd = $("#pass").val();
    var regPass = pwd.search("^[a-zA-Z0-9@#\$%\&\*]{8,16}$");
    if(regPass === -1)
    {
        $("#formAlert").html("Invalid password");
        $("#formAlert").css("visibility","visible");
    }
    else
    {
        error--;
    }
    return error;
}

function loginAct() {
    $("#formAlert").css("visibility","hidden");

    var name = $("#uname").val();
    var pwd = $("#pass").val();

    var error = validator();
    if(error === 0) {
        checker(name,pwd);
    }
}