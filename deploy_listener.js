var hookshot = require('hookshot');
hookshot('refs/heads/master', 'git fetch origin && git checkout origin/master && npm rebuild  && restart ghost').listen(1911);
