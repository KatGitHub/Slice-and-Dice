var sessionModule = (function() {
    var sessionManager,
        CONSTANTS = {
            API_KEY: 'cY1MfyFqnit8iGSj'
        },
        token;
    sessionManager = (function() {
        var sessionManager = Object.create({});

        if (localStorage.getItem('__everlive_auth_keycY1MfyFqnit8iGSj$authentication')) {
            token = JSON.parse(localStorage.getItem('__everlive_auth_keycY1MfyFqnit8iGSj$authentication'))['token'];
        }

        Object.defineProperty(sessionManager, 'init', {
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
        Object.defineProperty(sessionManager, 'checkIfLoggedIn', {
            value: function() {
                return localStorage.getItem('__everlive_auth_keycY1MfyFqnit8iGSj$authentication');
            }
        });
        Object.defineProperty(sessionManager, 'registerUser', {
            value: function() {
                var self = this;
                var username = $('#register-username').val();
                var password = $('#register-password').val();
                var attrs = {
                    Email: $('#email').val(),
                    DisplayName: $('#nickname').val()
                };

                this.db.Users.register(username,
                    password,
                    attrs,
                    function(data) {
                        self.authenticateUser(username, password);
                        window.location.hash = '#/';
                        toastr.success("Registered successfully!");
                    },
                    function(error) {
                        toastr.error(error.message);
                    });
            }
        });
        Object.defineProperty(sessionManager, 'logout', {
            value: function() {
                this.db.authentication.logout(function() {
                    window.location.hash = '#/login';
                    $('#li-logout').hide();
                    $('#li-login').show();
                    $('#li-register').show();
                });
            }
        });
        Object.defineProperty(sessionManager, 'logUser', {
            value: function() {
                this.logout();
                var username = $('#username').val(),
                    password = $('#password').val();
                $('#invalid-login').hide();

                this.authenticateUser(username, password);
            }
        });
        Object.defineProperty(sessionManager, 'authenticateUser', {
            value: function(username, password) {
                this.db.authentication.login(username, password,
                    function(data) {
                        window.location.hash = '#/';
                        $('#li-login').hide();
                        $('#li-register').hide();
                        $('#li-logout').show();
                    },
                    function(error) {
                        toastr.error(error.message);
                    });
            }
        });
        return sessionManager;
    }());

    return Object.create(sessionManager).init();
}());
