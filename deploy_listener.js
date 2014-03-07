var hookshot = require('hookshot');
hookshot('refs/heads/master', 'stop ghost && git fetch origin && git checkout origin/master && npm rebuild && start ghost').listen(1911);
