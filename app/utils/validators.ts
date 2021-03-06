export class BglValidators {
    weburl(c) {
        var urlRegex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
        if (c.value && !c.value.match(urlRegex)) {
            return {
                weburl: true
            };
        }
        return null;
    }
    urlTemplate(c) {
        //var templateRegex = '/\[\?\]/';
        //if (c.value && !c.value.match(templateRegex)) {
        if (c.value && c.value.indexOf('[?]') < 1) {
            return {
                urlTemplate: true
            };
        }
        return null;
    }
    email(c) {
        var emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        if (c.value && !c.value.match(emailRegex)) {
            return {
                email: true
            };
        }
        // return null = valid
        return null;
    }
    password(c) {
        var minlength = 4;
        if (c.value && c.value.length < 4) {
            return {
                password: true
            };
        }
        return null;
    }
}

