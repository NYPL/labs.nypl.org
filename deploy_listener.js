var hookshot = require('hookshot');
hookshot('refs/heads/master', 'cd /var/www/ghost && stop ghost && git fetch origin && git checkout origin/master -f && npm rebuild && start ghost').listen(1911);

