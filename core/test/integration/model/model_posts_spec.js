/*globals describe, before, beforeEach, afterEach, it */
var testUtils     = require('../../utils'),
    should        = require('should'),
    _             = require('lodash'),
    when          = require('when'),
    sequence      = require('when/sequence'),

    // Stuff we are testing
    DataGenerator = require('../../utils/fixtures/data-generator'),
    Models        = require('../../../server/models');

describe('Post Model', function () {

    var PostModel = Models.Post,
        UserModel = Models.User;

    before(function (done) {
        testUtils.clearData().then(function () {
            done();
        }, done);
    });

    beforeEach(function (done) {
        testUtils.initData()
            .then(function () {
                return testUtils.insertDefaultFixtures();
            })
            .then(function () {
                done();
            }, done);
    });

    afterEach(function (done) {
        testUtils.clearData().then(function () {
            done();
        }, done);
    });

    it('can browse', function (done) {
        PostModel.browse().then(function (results) {
            should.exist(results);
            results.length.should.be.above(1);

            // should be in published_at, DESC order
            // model and API differ here - need to fix
            //results.models[0].attributes.published_at.should.be.above(results.models[1].attributes.published_at);

            done();
        }).then(null, done);
    });

    it('can read', function (done) {
        var firstPost;

        PostModel.browse().then(function (results) {
            should.exist(results);
            results.length.should.be.above(0);
            firstPost = results.models[0];

            return PostModel.read({slug: firstPost.attributes.slug});
        }).then(function (found) {
            should.exist(found);
            found.attributes.title.should.equal(firstPost.attributes.title);

            done();
        }).then(null, done);
    });

    it('can findAll, returning author and user data', function (done) {
        var firstPost;

        PostModel.findAll({}).then(function (results) {
            should.exist(results);
            results.length.should.be.above(0);
            firstPost = results.models[0].toJSON();

            firstPost.author.should.be.an.Object;
            firstPost.user.should.be.an.Object;
            firstPost.author.name.should.equal(DataGenerator.Content.users[0].name);
            firstPost.user.name.should.equal(DataGenerator.Content.users[0].name);

            done();
        }, done);
    });

    it('can findOne, returning author and user data', function (done) {
        var firstPost;

        PostModel.findOne({}).then(function (result) {
            should.exist(result);
            firstPost = result.toJSON();

            firstPost.author.should.be.an.Object;
            firstPost.user.should.be.an.Object;
            firstPost.author.name.should.equal(testUtils.DataGenerator.Content.users[0].name);
            firstPost.user.name.should.equal(testUtils.DataGenerator.Content.users[0].name);

            done();
        }, done);
    });

    it('can edit', function (done) {
        var firstPost;

        PostModel.browse().then(function (results) {
            should.exist(results);
            results.length.should.be.above(0);
            firstPost = results.models[0];

            return PostModel.edit({id: firstPost.id, title: 'new title'});
        }).then(function (edited) {
            should.exist(edited);
            edited.attributes.title.should.equal('new title');

            done();
        }).then(null, done);
    });

    it('can add, defaults are all correct', function (done) {
        var createdPostUpdatedDate,
            newPost = testUtils.DataGenerator.forModel.posts[2],
            newPostDB = testUtils.DataGenerator.Content.posts[2];

        PostModel.add(newPost).then(function (createdPost) {
            return new PostModel({id: createdPost.id}).fetch();
        }).then(function (createdPost) {
            should.exist(createdPost);
            createdPost.has('uuid').should.equal(true);
            createdPost.get('status').should.equal('draft');
            createdPost.get('title').should.equal(newPost.title, 'title is correct');
            createdPost.get('markdown').should.equal(newPost.markdown, 'markdown is correct');
            createdPost.has('html').should.equal(true);
            createdPost.get('html').should.equal(newPostDB.html);
            createdPost.get('slug').should.equal(newPostDB.slug + '-2');
            (!!createdPost.get('featured')).should.equal(false);
            (!!createdPost.get('page')).should.equal(false);
            createdPost.get('language').should.equal('en_US');
            // testing for nulls
            (createdPost.get('image') === null).should.equal(true);
            (createdPost.get('meta_title') === null).should.equal(true);
            (createdPost.get('meta_description') === null).should.equal(true);

            createdPost.get('created_at').should.be.above(new Date(0).getTime());
            createdPost.get('created_by').should.equal(1);
            createdPost.get('author_id').should.equal(1);
            createdPost.get('created_by').should.equal(createdPost.get('author_id'));
            createdPost.get('updated_at').should.be.above(new Date(0).getTime());
            createdPost.get('updated_by').should.equal(1);
            should.equal(createdPost.get('published_at'), null);
            should.equal(createdPost.get('published_by'), null);

            createdPostUpdatedDate = createdPost.get('updated_at');

            // Set the status to published to check that `published_at` is set.
            return createdPost.save({status: 'published'});
        }).then(function (publishedPost) {
            publishedPost.get('published_at').should.be.instanceOf(Date);
            publishedPost.get('published_by').should.equal(1);
            publishedPost.get('updated_at').should.be.instanceOf(Date);
            publishedPost.get('updated_by').should.equal(1);
            publishedPost.get('updated_at').should.not.equal(createdPostUpdatedDate);

            done();
        }).then(null, done);

    });

    it('can add, with previous published_at date', function (done) {
        var previousPublishedAtDate = new Date(2013, 8, 21, 12);

        PostModel.add({
            status: 'published',
            published_at: previousPublishedAtDate,
            title: 'published_at test',
            markdown: 'This is some content'
        }).then(function (newPost) {

            should.exist(newPost);
            new Date(newPost.get('published_at')).getTime().should.equal(previousPublishedAtDate.getTime());

            done();

        }).otherwise(done);
    });

    it('can trim title', function (done) {
        var untrimmedCreateTitle = '  test trimmed create title  ',
            untrimmedUpdateTitle = '  test trimmed update title  ',
            newPost = {
                title: untrimmedCreateTitle,
                markdown: 'Test Content'
            };

        PostModel.add(newPost).then(function (createdPost) {
            return new PostModel({ id: createdPost.id }).fetch();
        }).then(function (createdPost) {
            should.exist(createdPost);
            createdPost.get('title').should.equal(untrimmedCreateTitle.trim());

            return createdPost.save({ title: untrimmedUpdateTitle });
        }).then(function (updatedPost) {
            updatedPost.get('title').should.equal(untrimmedUpdateTitle.trim());

            done();
        }).otherwise(done);
    });

    it('can generate a non conflicting slug', function (done) {
        var newPost = {
                title: 'Test Title',
                markdown: 'Test Content 1'
            };

        // Create 12 posts with the same title
        sequence(_.times(12, function (i) {
            return function () {
                return PostModel.add({
                    title: 'Test Title',
                    markdown: 'Test Content ' + (i+1)
                });
            };
        })).then(function (createdPosts) {
            // Should have created 12 posts
            createdPosts.length.should.equal(12);

            // Should have unique slugs and contents
            _(createdPosts).each(function (post, i) {
                var num = i + 1;

                // First one has normal title
                if (num === 1) {
                    post.get('slug').should.equal('test-title');
                    return;
                }

                post.get('slug').should.equal('test-title-' + num);
                post.get('markdown').should.equal('Test Content ' + num);
            });

            done();
        }).otherwise(done);
    });

    it('can generate slugs without duplicate hyphens', function (done) {
        var newPost = {
            title: 'apprehensive  titles  have  too  many  spaces—and m-dashes  —  –  and also n-dashes  ',
            markdown: 'Test Content 1'
        };

        PostModel.add(newPost).then(function (createdPost) {

            createdPost.get('slug').should.equal('apprehensive-titles-have-too-many-spaces-and-m-dashes-and-also-n-dashes');

            done();
        }).then(null, done);
    });

    it('can generate a safe slug when a reserved keyword is used', function(done) {
        var newPost = {
            title: 'rss',
            markdown: 'Test Content 1'
        };

        PostModel.add(newPost).then(function (createdPost) {
            createdPost.get('slug').should.not.equal('rss');
            done();
        });
    });

    it('can generate slugs without non-ascii characters', function (done) {
        var newPost = {
            title: 'भुते धडकी भरवणारा आहेत',
            markdown: 'Test Content 1'
        };

        PostModel.add(newPost).then(function (createdPost) {
            createdPost.get('slug').should.equal('bhute-dhddkii-bhrvnnaaraa-aahet');
            done();
        });
    });

    it('detects duplicate slugs before saving', function (done) {
        var firstPost = {
                title: 'First post',
                markdown: 'First content 1'
            },
            secondPost = {
                title: 'Second post',
                markdown: 'Second content 1'
            };

        // Create the first post
        PostModel.add(firstPost)
            .then(function (createdFirstPost) {
                // Store the slug for later
                firstPost.slug = createdFirstPost.get('slug');

                // Create the second post
                return PostModel.add(secondPost);
            }).then(function (createdSecondPost) {
                // Store the slug for comparison later
                secondPost.slug = createdSecondPost.get('slug');

                // Update with a conflicting slug from the first post
                return createdSecondPost.save({
                    slug: firstPost.slug
                });
            }).then(function (updatedSecondPost) {

                // Should have updated from original
                updatedSecondPost.get('slug').should.not.equal(secondPost.slug);
                // Should not have a conflicted slug from the first
                updatedSecondPost.get('slug').should.not.equal(firstPost.slug);

                return PostModel.read({
                    id: updatedSecondPost.id,
                    status: 'all'
                });
            }).then(function (foundPost) {

                // Should have updated from original
                foundPost.get('slug').should.not.equal(secondPost.slug);
                // Should not have a conflicted slug from the first
                foundPost.get('slug').should.not.equal(firstPost.slug);

                done();
            }).otherwise(done);
    });

    it('can delete', function (done) {
        var firstPostId;
        PostModel.browse().then(function (results) {
            should.exist(results);
            results.length.should.be.above(0);
            firstPostId = results.models[0].id;

            return PostModel.destroy(firstPostId);
        }).then(function () {
            return PostModel.browse();
        }).then(function (newResults) {
            var ids, hasDeletedId;

            ids = _.pluck(newResults.models, 'id');
            hasDeletedId = _.any(ids, function (id) {
                return id === firstPostId;
            });
            hasDeletedId.should.equal(false);

            done();
        }).then(null, done);
    });

    it('can fetch a paginated set, with various options', function (done) {
        testUtils.insertMorePosts().then(function () {

            return testUtils.insertMorePostsTags();
        }).then(function () {
            return PostModel.findPage({page: 2});
        }).then(function (paginationResult) {
            paginationResult.page.should.equal(2);
            paginationResult.limit.should.equal(15);
            paginationResult.posts.length.should.equal(15);
            paginationResult.pages.should.equal(4);

            return PostModel.findPage({page: 5});
        }).then(function (paginationResult) {
            paginationResult.page.should.equal(5);
            paginationResult.limit.should.equal(15);
            paginationResult.posts.length.should.equal(0);
            paginationResult.pages.should.equal(4);

            return PostModel.findPage({limit: 30});
        }).then(function (paginationResult) {
            paginationResult.page.should.equal(1);
            paginationResult.limit.should.equal(30);
            paginationResult.posts.length.should.equal(30);
            paginationResult.pages.should.equal(2);

            return PostModel.findPage({limit: 10, staticPages: true});
        }).then(function (paginationResult) {
            paginationResult.page.should.equal(1);
            paginationResult.limit.should.equal(10);
            paginationResult.posts.length.should.equal(1);
            paginationResult.pages.should.equal(1);

            return PostModel.findPage({limit: 10, page: 2, status: 'all'});
        }).then(function (paginationResult) {
            paginationResult.pages.should.equal(11);

            // Test tag filter
            return PostModel.findPage({page: 1, tag: 'bacon'});
        }).then(function (paginationResult) {
            paginationResult.page.should.equal(1);
            paginationResult.limit.should.equal(15);
            paginationResult.posts.length.should.equal(2);
            paginationResult.pages.should.equal(1);
            paginationResult.aspect.tag.name.should.equal('bacon');
            paginationResult.aspect.tag.slug.should.equal('bacon');

            return PostModel.findPage({page: 1, tag: 'kitchen-sink'});
        }).then(function (paginationResult) {
            paginationResult.page.should.equal(1);
            paginationResult.limit.should.equal(15);
            paginationResult.posts.length.should.equal(2);
            paginationResult.pages.should.equal(1);
            paginationResult.aspect.tag.name.should.equal('kitchen sink');
            paginationResult.aspect.tag.slug.should.equal('kitchen-sink');

            return PostModel.findPage({page: 1, tag: 'injection'});
        }).then(function (paginationResult) {
            paginationResult.page.should.equal(1);
            paginationResult.limit.should.equal(15);
            paginationResult.posts.length.should.equal(15);
            paginationResult.pages.should.equal(2);
            paginationResult.aspect.tag.name.should.equal('injection');
            paginationResult.aspect.tag.slug.should.equal('injection');

            return PostModel.findPage({page: 2, tag: 'injection'});
        }).then(function (paginationResult) {
            paginationResult.page.should.equal(2);
            paginationResult.limit.should.equal(15);
            paginationResult.posts.length.should.equal(9);
            paginationResult.pages.should.equal(2);
            paginationResult.aspect.tag.name.should.equal('injection');
            paginationResult.aspect.tag.slug.should.equal('injection');

            done();
        }).then(null, done);
    });

    // disabling sanitization until we can implement a better version
    // it('should sanitize the title', function (done) {
    //    new PostModel().fetch().then(function (model) {
    //        return model.set({'title': "</title></head><body><script>alert('blogtitle');</script>"}).save();
    //    }).then(function (saved) {
    //        saved.get('title').should.eql("&lt;/title&gt;&lt;/head>&lt;body&gt;[removed]alert&#40;'blogtitle'&#41;;[removed]");
    //        done();
    //    }).otherwise(done);
    // });
});
