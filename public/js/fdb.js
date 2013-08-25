//***********************************************
// "Insert in database" function
//***********************************************
function insertInDB() {

    hideAlert();

    if ($('#insertkey').val().length > 0
        && $('#insertvalue').val().length > 0) {

        $('#insertBtn').attr('disabled', 'disabled');
            
        $.ajax({
            type: "POST",
            url: "/fdb",
            data: JSON.stringify( { key:$('#insertkey').val(), value:$('#insertvalue').val() } ),
            success: function(data, textStatus, jqXHR) {
                showAlert("Success !", false);
                $('#insertkey').val('');
                $('#insertvalue').val('');
            },
            contentType: "application/json"
        })
        .fail(function() {
            showAlert("Sorry, there is an error...", true);
        })
        .always(function() {
            $('#insertBtn').removeAttr('disabled');
        });
    }
    else {
        showAlert("Please, you have to provide a key and a value", true);
    }
}
    
//***********************************************
// "Search in database" functions
//***********************************************
function findByKeyInDB() {

    hideAlert();

    if ($('#querykey').val().length > 0) {
        
        $('#queryvalue').val('');
        $('#findByKeyBtn').attr('disabled', 'disabled');
            
        $.ajax({
            type: "GET",
            url: "/fdb?key=" + $('#querykey').val(),
            success: function(data, textStatus, jqXHR) {
                $('#queryvalue').val(data.value);
            },
            contentType: "application/json"
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 404) {
                showAlert("No value for the key : '" + $('#querykey').val(), true);
            }
            else {
                showAlert("Sorry, there is an internal error...", true);
            }
        })
        .always(function() {
            $('#findByKeyBtn').removeAttr('disabled');
        });
    }
    else {
        showAlert("Please, you have to provide a key and a value", true);
    }
}

function findByRangeInDB() {
    
    hideAlert();
    $("#queryvalues").hide();

    if ($('#querybegin').val().length > 0
        && $('#queryend').val().length > 0) {

        $('#findByRangeBtn').attr('disabled', 'disabled');
            
        $.ajax({
            type: "GET",
            url: "/fdb?begin=" + $('#querybegin').val() + "&end=" + $('#queryend').val(),
            success: function(data, textStatus, jqXHR) {
                $("#queryvalues tbody tr").remove();
                var values = data.values;
                values.forEach(function(val) {
                    $("#queryvalues tbody").append("<tr><td>" + val.key 
                        + "</td><td>" + val.value + "</td></tr>");
                });
                $('#queryvalues').show();
            },
            contentType: "application/json"
        })
        .fail(function() {
            showAlert("Sorry, there is an error...", true);
        })
        .always(function() {
            $('#findByRangeBtn').removeAttr('disabled');
        });
    }
    else {
        showAlert("Please, you have to provide begin and end values", true);
    }
}

//***********************************************
// Other functions
//***********************************************
function showAlert(msg, error) {
    if (error) {
        $(".alert").removeClass("alert-success");
        $(".alert").addClass("alert-error");
    }
    else {
        $(".alert").addClass("alert-success");
        $(".alert").removeClass("alert-error");
    }
        
    $("#alert-message").html(msg);
    $(".alert").show();
}

function hideAlert() {
    $(".alert").hide();
}