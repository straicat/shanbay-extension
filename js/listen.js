function free_hint() {
    event.returnValue = false;
    var it = $('input:focus');
    var sp = '<span id="free-hint" style="font-size: 22px; line-height: 26px; text-align: center; ' + 
             'background-color: #FFFF33; height: 28px; width: ' + it.css('width') + '; position: absolute; left: ' +
             it.offset().left + 'px; top: ' + (it.offset().top - 30) + 'px;">' + it.attr('data') + '</span>';
    $('html').append(sp);
    it.blur(function () {
        $('#free-hint').remove();
    });
}
$(document).keydown(function (e) {
    if (e.keyCode == 56 || e.keyCode == 104) {
        free_hint();
    }
})
