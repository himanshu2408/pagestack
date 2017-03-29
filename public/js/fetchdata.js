$(function() {
    $.getJSON('api/get_all_user', updateTable);

});
function updateTable(data) {
    var output= '';
    $.each(data,function(key, item) {
        output += '<div class="col-md-4 col-sm-6 col-xxs-12">';
        output += '<div class="thumbnail">';
        output += '<img src="'+  item.img_loc  + '">';
        output += '<div class="caption" style="text-align:center">';
        output += '<h2>'+item.title+'</h2>';
        output += '<p>'+item.summary+'</p><div class="pull-right" style="cursor:pointer;"><i class="glyphicon glyphicon-remove" id="'+item._id+'"></i></div>';
        output += '</div>';
        output += '</div>';
        output += '</div>';

    });
    $('.mycards').html(output);
}

$('.cardslist').on('click', function (e) {
    if (e.target.className == 'glyphicon glyphicon-remove') {
        console.log(e.target.id);
        $.ajax({
            url: 'api/' + e.target.id,
            type: 'DELETE',
            success: window.location.href='/home'

        });

    }
});

function myfunc() {
    console.log("inside myfunc");
    $.getJSON('api/get_all_user', updateTable);
}