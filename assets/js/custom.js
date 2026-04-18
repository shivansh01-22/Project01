$(function () {
    const $window = $(window);
    const $navbar = $("#mainNav");
    const $scrollTopBtn = $("#scrollTopBtn");
    const words = ["UI/UX Design", "Clean interfaces","Responsive websites", "modern portfolios", "Re-Design Website"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let countersStarted = false;

    $(".preloader").addClass("hidden");
    $("#year").text(new Date().getFullYear());

    function handleScrollState() {
        const currentTop = $window.scrollTop();
        $navbar.toggleClass("scrolled", currentTop > 30);
        $scrollTopBtn.toggleClass("show", currentTop > 420);
    }

    function typeText() {
        const word = words[wordIndex];
        const nextText = isDeleting ? word.substring(0, charIndex - 1) : word.substring(0, charIndex + 1);

        $("#typedText").text(nextText);
        charIndex = nextText.length;

        let delay = isDeleting ? 45 : 85;

        if (!isDeleting && nextText === word) {
            delay = 1300;
            isDeleting = true;
        } else if (isDeleting && nextText === "") {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 300;
        }

        setTimeout(typeText, delay);
    }

    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                $(entry.target).addClass("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.16
    });

    $(".reveal").each(function () {
        revealObserver.observe(this);
    });

    const skillObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                $(".progress-bar").each(function () {
                    $(this).css("width", `${$(this).data("width")}%`);
                });
                skillObserver.disconnect();
            }
        });
    }, {
        threshold: 0.35
    });

    if ($("#skills").length) {
        skillObserver.observe($("#skills")[0]);
    }

    const counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                $(".counter").each(function () {
                    const $counter = $(this);
                    const target = Number($counter.data("target"));
                    const suffix = target === 100 ? "%" : "+";

                    $({ value: 0 }).animate({ value: target }, {
                        duration: 1400,
                        easing: "swing",
                        step: function (now) {
                            $counter.text(Math.floor(now) + suffix);
                        },
                        complete: function () {
                            $counter.text(target + suffix);
                        }
                    });
                });
                counterObserver.disconnect();
            }
        });
    }, {
        threshold: 0.45
    });

    if ($(".stats-band").length) {
        counterObserver.observe($(".stats-band")[0]);
    }

    $(".nav-link, .navbar-brand, .hero-actions a").on("click", function (event) {
        const targetId = $(this).attr("href");

        if (targetId && targetId.startsWith("#") && $(targetId).length) {
            event.preventDefault();
            $("html, body").animate({
                scrollTop: $(targetId).offset().top - 74
            }, 650);

            $(".navbar-collapse").collapse("hide");
        }
    });

    $scrollTopBtn.on("click", function () {
        $("html, body").animate({ scrollTop: 0 }, 650);
    });

    $("#contactForm").on("submit", function (event) {
        event.preventDefault();
        const form = this;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const $email = $("#email");
        const isEmailValid = emailPattern.test($email.val().trim());

        $email[0].setCustomValidity(isEmailValid ? "" : "Invalid email");

        if (!form.checkValidity()) {
            event.stopPropagation();
            $(form).addClass("was-validated");
            $("#formStatus").removeClass("text-success").addClass("text-danger").text("Please complete the highlighted fields.");
            return;
        }

        $(form).removeClass("was-validated");
        $("#formStatus").removeClass("text-danger").addClass("text-success").text("Thanks! Your message is ready to send.");
        form.reset();
    });

    $window.on("scroll", handleScrollState);
    handleScrollState();
    typeText();
});
