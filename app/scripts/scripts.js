$(function () {


    //navigation highlight vars
    $window = $(window);
    var menuItems = $("#resumenav").find("a.scroller");
    scrollItems = menuItems.map(function () {
        var item = $($(this).attr("href"));
        if (item.length) {
            return item;
        }
    });

    $('.last-section').css('min-height', $window.height() + 'px');

    //menu highlight
    function do_nav_actions() {
        var fromTop = $(this).scrollTop();
        var cur = scrollItems.map(function () {
            if ($(this).offset().top <= fromTop + 5) {
                return this;
            }
        });
        cur = cur[cur.length - 1];
        var id = cur && cur.length ? cur[0].id : "";
        menuItems
            .parent().removeClass("active")
            .end().filter("[href=#" + id + "]").parent().addClass("active");
    }

    $window.scroll(function () {
        do_nav_actions();
    }).scroll();


    //Timeline
    $('.timeline-item-trigger span').click(function () {
        if ($(this).hasClass('circle_plus')) {
            $(this).removeClass('circle_plus').addClass('circle_minus');
        }
        else {
            $(this).removeClass('circle_minus').addClass('circle_plus');
        }
    });

    $('.timeline-item-title').click(function () {
        $trigger = $(this).parent().parent().find('.timeline-item-trigger span');
        if ($trigger.hasClass('circle_plus')) {
            $trigger.removeClass('circle_plus').addClass('circle_minus');
        }
        else {
            $trigger.removeClass('circle_minus').addClass('circle_plus');
        }
    });


    //Scroll
    // top of page (action)
    $('.scroller').click(function (e) {
        e.preventDefault();
        var targetScroll = $(this).attr('href');
        var documentBody = $('html, body');
        $(documentBody).stop().animate({scrollTop: $(targetScroll).offset().top}, 1000, 'easeInOutCubic');
    });

    //Sidebar height
    function sidebarHeight() {
        var height = $('#main-content').height();
        $('#sidebar .sidebar-nav').height(height);
    }

    sidebarHeight();

    $('#main-content').resize(function () {
        sidebarHeight();
    });

    //viewport listener : load script regarding viewport height
    viewportWidth = $(window).width();
    if (viewportWidth >= 768) {
        viewPortContext = "desktop";
    } else {
        viewPortContext = "mobile";
    }

    function conditionalScripts(viewPortContext) {

        newViewportWidth = $(window).width();
        if (newViewportWidth >= 768) {
            newViewPortContext = "desktop";
        } else {
            newViewPortContext = "mobile";
        }

        if (viewPortContext != newViewPortContext) {

            if (newViewPortContext == 'desktop') { 	//scripts for desktop only

                //Add Tooltips
                $('.tips').tooltip();

            } else { 									//scripts for mobile only

                //Remove Tooltips
                $('.tips').tooltip('destroy');

            }
        }

        viewPortContext = newViewPortContext;
    }

    conditionalScripts(); //first execution

    $(window).resize(function () { //execution on window resizing
        conditionalScripts();
    });

    $('form').submit(function (e) {
        e.preventDefault();
        var $form = $(this);
        var $emailSuccess = $('#email-success').addClass('hidden');
        var $emailError = $('#email-error').addClass('hidden');
        var errorsElement = $emailError.find('.errors');
        errorsElement.empty();

        $.ajax({
            url: "http://dzs.azurewebsites.net/api/SendEmail",
            type: 'POST',
            data: {
                FromEmail: $form.find('#form-email').val(),
                Subject: $form.find('#form-subject').val(),
                Body: $form.find('#form-message').val(),
                FromName: $form.find('#form-name').val()
            }
        }).success(function (response) {
            if (response === true){
                $emailSuccess.removeClass('hidden');
            } else {
                errorsElement.append($('<p/>')
                    .text("Email sending service is unavailable. Please contact me via email or by phone directly."));
                $emailError.removeClass('hidden');
            }
        }).fail(function (response, a, b, c, d) {
            $.each(JSON.parse(response.responseText).modelState,
                function (i, elem) {
                    errorsElement.append($('<p/>').text(elem));
                });
            $emailError.removeClass('hidden');
        });
    })

});

// dzs: dzhivtsov yjdsqujl2013