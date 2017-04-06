jQuery.fn.isChildAndSelfOf = function(b) {
    return (this.closest(b).length > 0);
};

$(function() {
    var INJECT = `
<script id='shanbay-word-tmpl'  type='text/x-jquery-tmpl'>
    <div id="shanbay-word-helper" style="border: 1px solid rgba(0, 0, 0, 0.2); border-radius: 6px; box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2); text-align: left; padding: 10px 10px; width: 276px; background-color: #FFF; position: absolute; left: \${posX}px; top: \${posY}px;">
    {{if status_code==0}}
        <div style="margin-bottom: 10px;">
            <a target="_blank" href="https://www.shanbay.com/bdc/vocabulary/\${data.id}" style="color: #000; text-decoration: none; font-size: 25px; line-height: 28px;">\${data.content}</a>
            {{if learning_id}}
                <a id="shanbay-forget-word" href="javascript:;" data="\${data.learning_id}" style="vertical-align: middle; cursor: pointer; font-size: 15px; text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25); display: inline-block; padding: 4px 12px; color: #FFF; text-decoration: none; background-color: #FF9900; float: right; line-height: 20px;">忘记</a>
            {{else}}
                <a id="shanbay-add-word" href="javascript:;" data="\${data.id}" style="vertical-align: middle; cursor: pointer; font-size: 15px; text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25); display: inline-block; padding: 4px 12px; color: #FFF; text-decoration: none; background-color: #17A086; float: right; line-height: 20px;">添加</a>
            {{/if}}
        </div>
        <div>
            {{each(i, cn) data.definitions.cn}}
                <div><span style="font-weight: bold;">\${cn.pos}</span><span>\${cn.defn}</span></div>
            {{/each}}
        </div>
        {{if data.retention}}
            <div style="margin-top: 10px; height: 10px; background-color: #CCC;">
                <div style="background-color: #009966; width: \${data.retention}%; height: 10px;" class=""></div>
            </div>
        {{/if}}
    {{else}}
        \${message}
    {{/if}}
    </div>
</script>
    `
    $('body').append(INJECT);

    $(document).dblclick(e => {
        if($(e.target).isChildAndSelfOf('#shanbay-word-helper')) {
            $('#shanbay-word-helper').remove();
        };
        var word = window.getSelection().toString().trim();
        if(undefined != word && null != word && word.length > 0) {
            chrome.runtime.sendMessage(
                {
                    action: 'lookup',
                    word: word,
                    posX: e.pageX - 138,
                    posY: e.pageY + 20
                }
            );
        }
    });

    $(document).click(e => {
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
});

chrome.runtime.onMessage.addListener(function(request, sender, sendReponse){
    if(request.message == 'success' && request.action == 'lookup') {
        var j = request.response;
        var tmpd = {
            posX: request.request.posX,
            posY: request.request.posY,
            status_code: j.status_code,
            data: j.data,
            learning_id: j.status_code == 0 ? j.data.learning_id : false,
            message: j.msg
        };
        $('#shanbay-word-tmpl').tmpl(tmpd).appendTo('body');
    }
    if(request.message == 'success' && request.action == 'add') {
        if(request.response.status_code == 0) {
            $('#shanbay-add-word').remove();
        }
    }
    if(request.message == 'success' && request.action == 'forget') {
        if(request.response.status_code == 0) {
            $('#shanbay-forget-word').remove();
        }
    }
});
