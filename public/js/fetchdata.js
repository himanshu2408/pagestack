$(function() {
    $.getJSON('api/get_all_user', updateTable);

});
function updateTable(data) {
    var output= '';
    $.each(data,function(key, item) {
        var summary = item.summary.substring(0,250);
        var link = "'/home/"+item._id+"'";
        output += '<div class="col-md-4 col-sm-6 col-xxs-12">';
        output += '<div class="thumbnail" onclick="location.href='+link+'" style="position:relative; height:300px;cursor: pointer;">';
        output += '<img src="'+  item.img_loc  + '">';
        output += '<div style="text-align:center">';
        output += '<h3>'+item.title+'</h3>';
        output += '<p class="card-text">'+summary+'</p><div class="pull-right" style="cursor:pointer;position:absolute;top:5px;right:8px;"><i class="fa fa-trash-o" id="'+item._id+'"></i></div>';
        output += '</div>';
        output += '</div>';
        output += '</div>';

    });
    $('.mycards').html(output);
}

$('.cardslist').on('click', function (e) {
    if (e.target.className == 'fa fa-trash-o') {
        console.log(e.target.id);
        $.ajax({
            url: 'api/' + e.target.id,
            type: 'DELETE',
            success: window.location.href='/home'

        });

    }
});
