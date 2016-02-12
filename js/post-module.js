var postModule = (function postModule() {
    var postModule = (function() {
        var posts,
            recentPosts,
            recentComments,
            archivePosts,
            CONSTANTS = {
                API_KEY: 'cY1MfyFqnit8iGSj'
            },
            token,
            validator = {};

        if (localStorage.getItem('__everlive_auth_keycY1MfyFqnit8iGSj$authentication')) {
            token = JSON.parse(localStorage.getItem('__everlive_auth_keycY1MfyFqnit8iGSj$authentication'))['token'];
        }

        posts = (function() {
            var posts = Object.create({});

            Object.defineProperty(posts, 'init', {
                value: function() {
                    this.db = new Everlive({
                        apiKey: CONSTANTS.API_KEY,
                        token: token,
                        authentication: {
                            persist: true,
                            onAuthenticationRequired: function() {
                                window.location.hash = '#/login';
                            }
                        }
                    });
                    return this;
                }
            });
            Object.defineProperty(posts, 'getAll', {
                value: function(context) {
                    var self = this,
                        posts,
                        category = context.params.category,
                        count,
                        pageNumber = context.params.page || 1,
                        recentPosts;

                    var expandExp = {
                        "CreatedBy": {
                            "TargetTypeName": "Users"
                        }
                    };
                    var query1 = new Everlive.Query();
                    query1.expand(expandExp);
                    var expData = self.db.data('Posts').expand(expandExp);

                    if (category) {
                        var filter = {
                            'Category': category
                        };
                    }



                    expData.get(filter)
                        .then(function(data) {
                            count = data.result.length;
                            $.each(data.result, function(index, value) {
                                value['FormattedDate'] = moment().format("MMMM Do, YYYY");
                            });
                            var newArr = _.slice(data.result, pageNumber * 2 - 2, pageNumber * 2);

                            self.getSidebarPosts(function() {
                                templateManager.loadTemplate("posts.html", {
                                    'newArr': newArr,
                                    'count': count,
                                    'currentPage': pageNumber,
                                    'numberOfPages': Math.ceil(count / 2),
                                    'recentPosts': recentPosts,
                                    'recentComments': recentComments,
                                    'archivePosts': archivePosts
                                }, " | Posts");
                            });
                        })
                }
            });
            Object.defineProperty(posts, 'getPost', {
                value: function(context) {
                    var self = this,
                        posts,
                        id = context.params.id;

                    var expandExp = {
                        "CreatedBy": {
                            "TargetTypeName": "Users"
                        }
                    };
                    var query = new Everlive.Query();
                    query.expand(expandExp);
                    var expData = self.db.data('Posts').expand(expandExp);

                    if (id) {
                        var filter = {
                            'Id': id
                        };
                    }
                    expData.get(filter)
                        .then(function(data) {
                                $.each(data.result, function(index, value) {
                                    value['FormattedDate'] = moment().format("MMMM Do, YYYY");
                                });
                                var post = data.result;
                                var comments;

                                var expandExp = {
                                    "CreatedBy": {
                                        "TargetTypeName": "Users"
                                    }
                                };
                                var query = new Everlive.Query();
                                query.expand(expandExp);
                                var expData = self.db.data('Comments').expand(expandExp);


                                var filter = new Everlive.Query();
                                filter.where().eq('PostId', id);
                                expData.get(filter)
                                    .then(function(data) {
                                            comments = data.result;
                                            $.each(comments, function(index, value) {
                                                value['FormattedDate'] = moment().format("MMMM Do, YYYY");
                                            });
                                            $('.details-container').show();
                                            $('.title-container').text(post[0].Title);
                                            $('.info-container').text('Posted by ' + post[0].CreatedBy.DisplayName + ' in ' + post[0].Category + ' on ' + post[0].FormattedDate + ' | ' + comments.length + ' comments');

                                            self.getSidebarPosts(function() {
                                                templateManager.loadTemplate("post.html", {
                                                    'Post': post,
                                                    'Comments': comments,
                                                    'recentPosts': recentPosts,
                                                    'recentComments': recentComments,
                                                    'archivePosts': archivePosts
                                                }, " | Post", null, function(e) {
                                                    $('#btn-comment').on('click', function(e) {
                                                        e.preventDefault();
                                                        self.addComment(context);
                                                    });
                                                });
                                            });
                                        },
                                        function(error) {
                                            console.log(JSON.stringify(error));
                                        });
                            },
                            function(error) {
                                console.log(JSON.stringify(error));
                            });

                }
            });
            Object.defineProperty(posts, 'postArticle', {
                value: function() {
                    var title = $('#title').val();
                    var text = $('#text').val();
                    var image = $('#image').val();
                    var username;

                    this.db.data('Posts').create({
                            'Title': title,
                            'Text': text,
                            'Image': image
                        },
                        function(data) {
                            window.location.hash = '#/post?id=' + data.result.Id;
                        },
                        function(error) {
                            alert(JSON.stringify(error));
                        });
                }
            });
            Object.defineProperty(posts, 'addComment', {
                value: function(context) {
                    var self = this;
                    var id = context.params.id;
                    var commentText = $('.wb-comment').val();

                    this.db.data('Comments').create({
                            'Text': commentText,
                            'PostId': id
                        },
                        function(data) {
                            window.location.hash = '#/post?id=1' + id;
                            window.location.hash = '#/post?id=' + id;
                        },
                        function(error) {
                            console.log(JSON.stringify(error));
                        });
                }
            });
            Object.defineProperty(posts, 'getSidebarPosts', {
                value: function(cb) {
                    var self = this;
                    var recentPostsQuery = new Everlive.Query();
                    var recentCommentsQuery = new Everlive.Query();
                    var archivePostsQuery = new Everlive.Query();
                    recentPostsQuery.skip(0).take(5);
                    recentCommentsQuery.skip(0).take(5);
                    archivePostsQuery.skip(5).take(5);
                    self.db.data('Posts').get(recentPostsQuery)
                        .then(function(data) {
                            recentPosts = data.result;
                            var expandExp = {
                                "CreatedBy": {
                                    "TargetTypeName": "Users"
                                }
                            };
                            var query = new Everlive.Query();
                            query.expand(expandExp);
                            var expData = self.db.data('Comments').expand(expandExp);
                            expData.get(recentCommentsQuery)
                                .then(function(data) {
                                    recentComments = data.result;
                                    self.db.data('Posts').get(archivePostsQuery)
                                        .then(function(data) {
                                            archivePosts = data.result;
                                            cb();
                                        })
                                })
                        });
                }
            });
            return posts;
        }());

        return {
            getPostManager: function() {
                return Object.create(posts).init();
            },
            constants: CONSTANTS
        };

    }());
    return postModule;
}());
