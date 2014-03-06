var hookshot = require('hookshot');
hookshot('refs/heads/master', 'git fetch origin && git checkout origin/master && npm rebuild  && service ghost restart').listen(1911);
