/*globals casper, __utils__, url, testPost */

CasperTest.begin("Content screen is correct", 20, function suite(test) {
    // Create a sample post
    casper.thenOpen(url + 'ghost/editor/', function testTitleAndUrl() {
        test.assertTitle('Ghost Admin', 'Ghost admin has no title');
    });

    casper.then(function createTestPost() {
        casper.sendKeys('#entry-title', testPost.title);
        casper.writeContentToCodeMirror(testPost.html);
    });

    casper.waitForSelectorTextChange('.entry-preview .rendered-markdown', function onSuccess() {
        test.assertSelectorHasText('.entry-preview .rendered-markdown', 'test', 'Editor value is correct');
    });

    casper.thenClick('.js-publish-button');

    casper.waitForResource(/posts\/$/, function checkPostWasCreated() {
        test.assertExists('.notification-success', 'got success notification');
    });

    // Begin test
    casper.thenOpen(url + "ghost/content/", function testTitleAndUrl() {
        test.assertTitle("Ghost Admin", "Ghost admin has no title");
        test.assertUrlMatch(/ghost\/content\/$/, "Ghost doesn't require login this time");
    });

    casper.then(function testMenus() {
        test.assertExists("#main-menu", "Main menu is present");
        test.assertSelectorHasText("#main-menu .content a", "Content");
        test.assertSelectorHasText("#main-menu .editor a", "New Post");
        test.assertSelectorHasText("#main-menu .settings a", "Settings");

        test.assertExists("#usermenu", "User menu is present");
        test.assertSelectorHasText("#usermenu .usermenu-profile a", "Your Profile");
        test.assertSelectorHasText("#usermenu .usermenu-help a", "Help / Support");
        test.assertSelectorHasText("#usermenu .usermenu-signout a", "Sign Out");
    });

    casper.then(function testViews() {
        test.assertExists(".content-view-container", "Content main view is present");
        test.assertExists(".content-list-content", "Content list view is present");
        test.assertExists(".content-list-content li .entry-title", "Content list view has at least one item");
        test.assertExists(".content-preview", "Content preview is present");
        test.assertSelectorHasText(".content-list-content li:first-child h3", testPost.title, "item is present and has content");
    });

    casper.then(function testActiveItem() {
        test.assertEvalEquals(function () {
            return document.querySelector('.content-list-content li').className;
        }, "active", "first item is active");

    }).thenClick(".content-list-content li:nth-child(2) a", function then() {
        test.assertEvalEquals(function () {
            return document.querySelectorAll('.content-list-content li')[1].className;
        }, "active", "second item is active");
    });
});

CasperTest.begin('Infinite scrolling', 1, function suite(test) {
    // Placeholder for infinite scrolling/pagination tests (will need to setup 16+ posts).

    casper.thenOpen(url + 'ghost/content/', function testTitleAndUrl() {
        test.assertTitle('Ghost Admin', 'Ghost admin has no title');
    });
});

CasperTest.begin("Posts can be marked as featured", 12, function suite(test) {
    // Create a sample post
    casper.thenOpen(url + 'ghost/editor/', function testTitleAndUrl() {
        test.assertTitle('Ghost Admin', 'Ghost admin has no title');
    });

    casper.then(function createTestPost() {
        casper.sendKeys('#entry-title', testPost.title);
        casper.writeContentToCodeMirror(testPost.html);
    });

    casper.thenClick('.js-publish-button');

    casper.waitForSelector('.notification-success', function waitForSuccess() {
        test.assert(true, 'got success notification');
        test.assertSelectorHasText('.notification-success', 'Your post has been saved as a draft.');
    }, function onTimeout() {
        test.assert(false, 'No success notification :(');
    });

    // Begin test
    casper.thenOpen(url + "ghost/content/", function testTitleAndUrl() {
        test.assertTitle("Ghost Admin", "Ghost admin has no title");
    });

    // Mark as featured
    casper.waitForSelector('.content-preview .unfeatured', function () {
        this.click('.content-preview .unfeatured');
    }, function onTimeOut() {
        test.assert(false, 'The first post can\'t be marked as featured');
    });

    casper.waitForSelector('.notification-success', function waitForSuccess() {
        test.assert(true, 'got success notification');
        test.assertSelectorHasText('.notification-success', 'Post successfully marked as featured.');
    }, function onTimeout() {
        test.assert(false, 'No success notification :(');
    });

    casper.waitForSelector('.content-list-content li:first-child .featured', function () {
        test.assertExists('.content-preview .featured');
        test.assert(true, 'got a featured star');
        this.click('.notification-success .close');
    }, function onTimeout() {
        test.assert(false, 'No featured star appeard in the left pane');
    });

    // Mark as not featured
    casper.waitWhileSelector('.notification-success', function waitForNoSuccess() {
        this.click('.content-preview .featured');
    }, function onTimeout() {
        test.assert(false, 'Success notification wont go away:(');
    });

    casper.waitForSelector('.notification-success', function waitForSuccess() {
        test.assert(true, 'got success notification');
        test.assertSelectorHasText('.notification-success', 'Post successfully marked as not featured.');
        test.assertDoesntExist('.content-preview .featured');
        test.assertDoesntExist('.content-list-content li:first-child .featured');
    }, function onTimeout() {
        test.assert(false, 'Success notification wont go away:(');
    });
});