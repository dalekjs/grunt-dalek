module.exports = {
    // Checks if the <title> of ´github.com´ has the expected value
    'Page title is correct': function (test) {
        'use strict';
        test
            .open('http://github.com')
            .assert.title('GitHub · Build software better, together.')
            .screenshot('images/foo.jpg')
            .done();
    }
};