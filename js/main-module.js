var mainModule = (function mainModule() {
    var mainModule = (function() {
        var templateManager,
            generalManager,
            CONSTANTS = {
                "content": "#wb-content",
                "templatesFolder": "templates/",
                "titleBase": "Webly"
            };
        /**
         * The purpose of the templateManager Object is to manage and load the partials templates in the index.html #wb-content div
         * It caches the already requested templates
         * and changes the page's title
         */
        templateManager = (function() {
            var templateManager = Object.create({});

            Object.defineProperty(templateManager, 'init', {
                value: function() {
                    Handlebars.registerHelper('list', function(count) {
                        var pages = '';
                        for (var i = 1; i <= Math.ceil(count / 2); i++) {
                            pages += '<li><a href="#/posts?page=' + i + '">' + i + '</a></li>';
                        };
                        return pages;
                    });
                    this.content = $(CONSTANTS.content);
                    this.templates = {};
                    return this;
                }
            });
            Object.defineProperty(templateManager, 'getTemplate', {
                value: function(templateName) {
                    var self = this;
                    var promise = new Promise(function(resolve, reject) {
                        var url = CONSTANTS.templatesFolder + templateName;
                        if (self.templates[templateName]) {
                            resolve(self.templates[templateName]);
                            return;
                        }
                        $.ajax({
                            url: url,
                            success: function(html) {
                                resolve(html);
                                self.templates[templateName] = html;
                            },
                            error: function(err) {
                                reject(err);
                            }
                        });
                    });

                    return promise;
                }
            });
            Object.defineProperty(templateManager, 'loadTemplate', {
                value: function(templateName, options, title, content, cb) {
                    options = options || {};
                    title = title || '';
                    content = content || this.content;
                    document.title = CONSTANTS.titleBase + title;
                    var self = this;
                    content.empty();
                    self.getTemplate(templateName)
                        .then(function(templateHTML) {
                            var template = Handlebars.compile(templateHTML);
                            var html = template(options);
                            content.append(html);

                            if (typeof cb === 'function') {
                                cb();
                            }
                        });
                    return this;
                }
            });

            return templateManager;
        }());

        return {
            getTemplateManager: function() {
                return Object.create(templateManager).init();
            },
            constants: CONSTANTS
        };
    }());
    return mainModule;
}());
