$(function() {
    $('.checkbox').mouseup(e => {
        setTimeout(function() {
            $('.checkbox').parent().parent('.member')
                              .css('background-color', '#fff');
            $('.checked').parent().parent('.member')
                              .css('background-color', '#f8c1ab');
        }, 200);
    });
});
