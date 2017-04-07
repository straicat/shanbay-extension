$(function() {
    var hint_fgcolor = localStorage.hint_color.split('|')[0];
    var hint_bgcolor = localStorage.hint_color.split('|')[1];
    var hint_key = localStorage.hint_key;
    $('#id-hint-bgcolor').val(hint_bgcolor);
    $('#id-hint-fgcolor').val(hint_fgcolor);
    $('#id-hint-key-shortcut').val(hint_key);
    $('#id-hint-preview').css('background-color', $('#id-hint-bgcolor').val())
                         .css('color', $('#id-hint-fgcolor').val());
})
$('input').bind('input propertychange', function() {
    $('#id-hint-preview').css('background-color', $('#id-hint-bgcolor').val())
                         .css('color', $('#id-hint-fgcolor').val());
});

$('#opt-sub-btn').bind('click', function() {
    localStorage.hint_color = $('#id-hint-fgcolor').val() + '|' + $('#id-hint-bgcolor').val();
    localStorage.hint_key = $('#id-hint-key-shortcut').val();
    window.close();
});
