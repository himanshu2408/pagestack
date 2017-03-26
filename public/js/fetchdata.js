$(function() {
    $.getJSON('api/get_all_user', updateTable);

    function updateTable(data) {
    var output = '';
        $.each(data,function(key, item) {
            output += '<div class="col-md-4 col-sm-6 col-xxs-12">';
            output += '<a href="'+item.url+'" class="fh5co-project-item image-popup">';
            output += '<img src="images/img_1.jpg" alt="Image" class="img-responsive">';
            output += '<div class="fh5co-text">';
            output += '<h2>'+item.title+'</h2>';
            output += '<p>'+item.summary+'</p>';
            output += '</div>';
            output += '</a>';
            output += '</div>';

        });
        $('.mycards').html(output);
    }
});