var oauth = ShanbayOauth.initPage();

function logout(){
    oauth.clearToken();
}

function check_settings() {
    'hint_color' in localStorage ? {} :localStorage.hint_color = '#FFFFFF|#FE007F';
    'hint_key' in localStorage ? {} : localStorage.hint_key = 'key_8';
}

function send_ajax(request, url, method, data, tab_id) {
    $.ajax({
        url: url,
        method: method,
        headers: {Authorization: 'Bearer ' + window.localStorage.access_token},
        data: data,
        success : j => {
            chrome.tabs.sendMessage(tab_id, {
                action: request.action,
                message: 'success',
                request: request,
                response: j
            });
        },
        error : j => {
            chrome.tabs.sendMessage(tab_id, {
                action: request.action,
                message: 'error',
                request: request
            });
        }
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendReponse){
    if (request.action == 'authorize'){
        oauth.authorize(sendReponse);
    }

    var actionMap = {
        lookup: {
            url: 'https://www.shanbay.com/api/v1/bdc/search/?version=2&word=' + request.word,
            method: 'GET'
        },
        add: {
            url: 'https://api.shanbay.com/bdc/learning/',
            method: 'POST',
            data: request.id
        },
        forget: {
            url: 'https://api.shanbay.com/bdc/learning/' + request.learning_id + '/',
            method: 'PUT',
            data:  {forget: 1}
        }
    };
    
    if(request.action in actionMap) {
        var action = request.action;
        send_ajax(request, actionMap[action].url, actionMap[action].method, actionMap[action].data, sender.tab.id);
    }

    if(request.action == 'option') {
        check_settings();
        chrome.tabs.sendMessage(sender.tab.id, {
            action: 'option',
            message: 'success',
            request: request,
            response: localStorage[request.option]
        })
    }
});

check_settings();
