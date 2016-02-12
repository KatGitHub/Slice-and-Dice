var templateManager,
    postManager,
    sessionManager;
$(document).ready(function() {
    templateManager = mainModule.getTemplateManager();
    sessionManager = sessionModule;
    postManager = postModule.getPostManager();

    var sammy = Sammy('#wb-content', function() {

        this.get('#/', function() {
            templateManager.loadTemplate("home.html", {}, " | Home");
            $('#wb-header').addClass('home');
            $('#drawing-holder').show();
            $('.carousel').show();
            $('.details-container').hide();   
        });        
        this.get('#/login', function() {
            templateManager.loadTemplate("login.html", {}, " | Login", null, function() {
                $("#login-btn").on("click", function(e) {
                    e.preventDefault();
                    sessionManager.logUser();
                });
            });
            $('#wb-header').removeClass('home');
            $('#drawing-holder').hide();
            $('.carousel').hide();
            $('.details-container').hide();            
        });
        this.get('#/logout', function() {
        		$('.details-container').hide();   
            sessionManager.logout();
        });
        this.get('#/register', function() {
        		$('.details-container').hide();   
            templateManager.loadTemplate('register.html', {}, " | Registration", null, function() {
                $('#register-btn').on('click', function(e) {
                    e.preventDefault();
                    sessionManager.registerUser();
                });
            });
            $('#wb-header').removeClass('home');
            $('#drawing-holder').hide();
            $('.carousel').hide();
        });
        this.get('#/addpost', function() {
        		$('.details-container').hide();   
            templateManager.loadTemplate("add-post.html", {}, " | Add Post", null, function() {
                $('#post-btn').on('click', function(e) {
                    e.preventDefault();
                    if (!sessionManager.checkIfLoggedIn()) {
                        window.location.hash = '#/login';
                        toastr.warning('Please, log in!');
                    } else {
                        postManager.postArticle();
                    }
                });
            });
            $('#wb-header').removeClass('home');
            $('#drawing-holder').hide();
            $('.carousel').hide();
        });
        this.get('#/posts', function() {
        		$('.details-container').hide();   
        		var context = this;
            postManager.getAll(context);
            $('#wb-header').removeClass('home');
            $('#drawing-holder').hide();
            $('.carousel').hide();
        });
        this.get('#/post', function() {
        		$('.details-container').hide();   
        		var context = this;        		
            postManager.getPost(context);
            $('#wb-header').removeClass('home');
            $('#drawing-holder').hide();
            $('.carousel').hide();
        });
    });
    sammy.run('#/');
    //-------------- End of Site Routing ------------------//

    if (sessionManager.checkIfLoggedIn()) {
        $('#li-login').hide();
        $('#li-register').hide();
        $('#li-logout').show();
    }    

});
