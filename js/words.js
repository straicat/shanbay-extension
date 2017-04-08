jQuery.fn.isChildAndSelfOf = function(b) {
    return (this.closest(b).length > 0);
};

$(function() {
    if(window.location.href.startsWith('https://www.shanbay.com')) {
        return 0;
    }

    var INJECT = `
<script id='shanbay-word-tmpl'  type='text/x-jquery-tmpl'>
    <div id="shanbay-word-helper" style="left: \${pos.x}px; top: \${pos.y}px;">
    {{if status_code==0}}
        <div id="shanbay-ext-word-top">
            <a id="shanbay-ext-word" target="_blank" href="https://www.shanbay.com/bdc/vocabulary/\${data.id}">\${data.content}</a>
            {{if learning_id}}
                <a class="shanbay-ext-word-btn" id="shanbay-forget-word" href="javascript:;" data="\${data.learning_id}">忘记</a>
            {{else}}
                <a class="shanbay-ext-word-btn" id="shanbay-add-word" href="javascript:;" data="\${data.id}">添加</a>
            {{/if}}
        </div>
        <div>
            {{each(i, cn) data.definitions.cn}}
                <div><span class="shanbay-defn-pos">\${cn.pos}</span><span>\${cn.defn}</span></div>
            {{/each}}
        </div>
        {{if data.retention}}
            <div id="shanbay-word-retention-bar">
                <div id="shanbay-word-retention" style="width: \${data.retention}%;"></div>
            </div>
        {{/if}}
    {{else}}
        \${message}
    {{/if}}
    </div>
</script>
    `
    $('body').append(INJECT);

    var mousePos = null;

    $(document).dblclick(e => {
        if($(e.target).isChildAndSelfOf('#shanbay-word-helper')) {
            $('#shanbay-word-helper').remove();
            return 0;
        };
        var word = window.getSelection().toString().trim();
        if(undefined != word && null != word && word.length > 0) {
            chrome.runtime.sendMessage(
                {
                    action: 'lookup',
                    word: word,
                    pos: {x: e.pageX - 138, y: e.pageY + 20}
                }
            );
        }
    });

    $(document).click(e => {
        mousePos = {x: e.pageX, y: e.pageY};
        if(!$(e.target).isChildAndSelfOf('#shanbay-word-helper')) {
            $('#shanbay-word-helper').remove();
        }else{
            if($(e.target).isChildAndSelfOf('#shanbay-add-word')) {
                chrome.runtime.sendMessage(
                    {
                        action: 'add',
                        id: $('#shanbay-add-word').attr('data')
                    }
                );
            }
            if($(e.target).isChildAndSelfOf('#shanbay-forget-word')) {
                chrome.runtime.sendMessage(
                    {
                        action: 'forget',
                        learning_id: $('#shanbay-forget-word').attr('data')
                    }
                );
            }
        }
    });

    $(document).keydown(e => {
        if(e.ctrlKey) {
            var word = window.getSelection().toString().trim();
            if(undefined != word && null != word && word.length > 0 && null != mousePos) {
                chrome.runtime.sendMessage(
                    {
                        action: 'lookup',
                        word: word,
                        pos: {x: mousePos.x - 138, y: mousePos.y + 20}
                    }
                );
            }
        }
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendReponse) {
    if(request.message == 'success') {
        if(request.action == 'lookup') {
            var j = request.response;
            var tmpd = {
                pos: request.request.pos,
                status_code: j.status_code,
                data: j.data,
                learning_id: j.status_code == 0 ? j.data.learning_id : false,
                message: j.msg
            };
            $('#shanbay-word-tmpl').tmpl(tmpd).appendTo('body');
        }
        if(request.action == 'add') {
            $('#shanbay-add-word').remove();
        }
        if(request.action == 'forget') {
            $('#shanbay-forget-word').remove();
        }
    }
});
