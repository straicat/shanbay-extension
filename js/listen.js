var hint_key = null;
var hint_color = null;
var keyMap = {
    key_2: [50, 98],
    key_3: [51, 99],
    key_4: [52, 100],
    key_5: [53, 101],
    key_6: [54, 102],
    key_7: [55, 103],
    key_8: [56, 104],
    key_9: [57, 105],
    key_minus: [189, 109],
    key_equal: [187]
};
function free_hint() {
    event.returnValue = false;
    var it = $('input:focus');
    if(it.length) {
        var _offset = it.offset();
        var tmpd = {
            hint_fgcolor: hint_color.split('|')[0],
            hint_bgcolor: hint_color.split('|')[1],
            width: it.css('width'),
            left: _offset.left,
            top: _offset.top - 30,
            data: it.attr('data')
        }
        $('#shanbay-ext-listen-tmpl').tmpl(tmpd).appendTo('body');
        it.blur(function () {
            $('#shanbay-free-hint').remove();
        });
    }
}
chrome.runtime.sendMessage({
    action: 'option',
    option: 'hint_key',
});
chrome.runtime.sendMessage({
    action: 'option',
    option: 'hint_color',
});
chrome.runtime.onMessage.addListener(function (request, sender, sendReponse) {
    if (request.message == 'success' && request.action == 'option') {
        if (request.request.option == 'hint_key') {
            hint_key = request.response;
        }
        if (request.request.option == 'hint_color') {
            hint_color = request.response;
        }
    }
});
$(function () {
    var INJECT = `
<script id='shanbay-ext-listen-tmpl'  type='text/x-jquery-tmpl'>
    <span id="shanbay-free-hint" style="background-color: \${hint_bgcolor}; color: \${hint_fgcolor}; width: \${width}; left: \${left}px; top: \${top}px;">\${data}</span>
</script>
    `;
    $('body').append(INJECT);
});
$(document).keydown(e => {
    if (null != hint_key && null != hint_color) {
        if (-1 != $.inArray(e.keyCode, keyMap[hint_key])) {
            free_hint();
        }
    }
})
