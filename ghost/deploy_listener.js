var hookshot = require('hookshot');
hookshot('refs/heads/master', 'git fetch origin && git checkout origin/master && service ghost restart').listen(1911)
