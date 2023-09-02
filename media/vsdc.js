function drags(e, t, s) {
    let o = !1;
    window.addEventListener("touchstart", function() {
        o = !0
    }), window.addEventListener("touchend", function() {
        o = !1
    }), e.on("mousedown touchstart", function(n) {
        e.addClass("draggable"), t.addClass("resizable");
        let i = n.pageX ? n.pageX : n.originalEvent.touches[0].pageX,
            a = e.outerWidth(),
            d = e.offset().left + a - i,
            r = s.offset().left,
            c = s.outerWidth(),
            l = r + 10,
            u = r + c - a - 10;
        e.parents().on("mousemove touchmove", function(e) {
            !1 === o && e.preventDefault();
            let s = (e.pageX ? e.pageX : e.originalEvent.touches[0].pageX) + d - a;
            s < l ? s = l : s > u && (s = u);
            let n = 100 * (s + a / 2 - r) / c + "%";
            $(".draggable").css("left", n).on("mouseup touchend touchcancel", function() {
                $(this).removeClass("draggable"), t.removeClass("resizable")
            }), $(".resizable").css("width", n)
        }).on("mouseup touchend touchcancel", function() {
            e.removeClass("draggable"), t.removeClass("resizable")
        })
    }).on("mouseup touchend touchcancel", function(s) {
        e.removeClass("draggable"), t.removeClass("resizable")
    })
}
$(document).ready(function() {
    if ($(".comparison-slider")[0]) {
        let e = $(".comparison-slider");
        e.each(function() {
            let e = $(this).width() + "px";
            $(this).find(".resize img").css({
                width: e
            }), drags($(this).find(".divider"), $(this).find(".resize"), $(this))
        }), $(window).on("resize", function() {
            let t = e.width() + "px";
            e.find(".resize img").css({
                width: t
            })
        })
    }
});

//https://cdn.jsdelivr.net/npm/lazyframe/dist/lazyframe.min.js
! function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).lazyframe = e()
}(this, (function() {
    "use strict";

    function t() {
        return (t = Object.assign || function(t) {
            for (var e = 1; e < arguments.length; e++) {
                var n = arguments[e];
                for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i])
            }
            return t
        }).apply(this, arguments)
    }
    return function() {
        var e, n = [],
            i = {
                vendor: void 0,
                id: void 0,
                src: void 0,
                thumbnail: void 0,
                title: void 0,
                initialized: !1,
                y: void 0,
                debounce: 25,
                lazyload: !0,
                autoplay: !0,
                initinview: !1,
                onLoad: function(t) {},
                onAppend: function(t) {},
                onThumbnailLoad: function(t) {}
            },
            o = {
                regex: {
                    youtube_nocookie: /(?:youtube-nocookie\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=)))([a-zA-Z0-9_-]{6,11})/,
                    youtube: /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/,
                    vimeo: /vimeo\.com\/(?:video\/)?([0-9]*)(?:\?|)/
                },
                condition: {
                    youtube: function(t) {
                        return !(!t || 11 != t[1].length) && t[1]
                    },
                    youtube_nocookie: function(t) {
                        return !(!t || 11 != t[1].length) && t[1]
                    },
                    vimeo: function(t) {
                        return !!(t && 9 === t[1].length || 8 === t[1].length) && t[1]
                    }
                },
                src: {
                    youtube: function(t) {
                        return "https://www.youtube.com/embed/".concat(t.id, "/?autoplay=").concat(t.autoplay ? "1" : "0", "&").concat(t.query)
                    },
                    youtube_nocookie: function(t) {
                        return "https://www.youtube-nocookie.com/embed/".concat(t.id, "/?autoplay=").concat(t.autoplay ? "1" : "0", "&").concat(t.query)
                    },
                    vimeo: function(t) {
                        return "https://player.vimeo.com/video/".concat(t.id, "/?autoplay=").concat(t.autoplay ? "1" : "0", "&").concat(t.query)
                    }
                },
                endpoint: function(t) {
                    return "https://noembed.com/embed?url=".concat(t.src)
                },
                response: {
                    title: function(t) {
                        return t.title
                    },
                    thumbnail: function(t) {
                        return t.thumbnail_url
                    }
                }
            };

        function a(t) {
            var n = this;
            if (t instanceof HTMLElement != !1 && !t.classList.contains("lazyframe--loaded")) {
                var i = {
                    el: t,
                    settings: r(t)
                };
                i.el.addEventListener("click", (function() {
                    i.el.appendChild(i.iframe);
                    var e = t.querySelectorAll("iframe");
                    i.settings.onAppend.call(n, e[0])
                })), e.lazyload ? c(i) : l(i, i.settings.thumbnail)
            }
        }

        function r(n) {
            var i, a, r = Array.prototype.slice.apply(n.attributes).filter((function(t) {
                    return "" !== t.value
                })).reduce((function(t, e) {
                    return t[0 === e.name.indexOf("data-") ? e.name.split("data-")[1] : e.name] = e.value, t
                }), {}),
                l = t({}, e, r, {
                    y: n.offsetTop,
                    originalSrc: r.src,
                    query: (i = r.src, a = i.split("?"), a[1] ? a[1] : null)
                });
            if (l.vendor) {
                var u = l.src.match(o.regex[l.vendor]);
                l.id = o.condition[l.vendor](u)
            }
            return l
        }

        function l(t) {
            var e = this;
            ! function(t) {
                return !(true || !t.vendor || t.title && t.thumbnail)
            }(t.settings) ? c(t, !0): function(t, e) {
                var n = o.endpoint(t.settings),
                    i = new XMLHttpRequest;
                i.open("GET", n, !0), i.onload = function() {
                    if (i.status >= 200 && i.status < 400) {
                        var n = JSON.parse(i.responseText);
                        e(null, [n, t])
                    } else e(!0)
                }, i.onerror = function() {
                    e(!0)
                }, i.send()
            }(t, (function(n, i) {
                if (!n) {
                    var a = i[0],
                        r = i[1];
                    if (r.settings.title || (r.settings.title = o.response.title(a)), !r.settings.thumbnail) {
                        var l = o.response.thumbnail(a);
                        r.settings.thumbnail = l, t.settings.onThumbnailLoad.call(e, l)
                    }
                    c(r, !0)
                }
            }))
        }

        function u() {
            var t = this,
                i = window.innerHeight,
                o = n.length,
                a = function(e, n) {
                    e.settings.initialized = !0, e.el.classList.add("lazyframe--loaded"), o--, l(e), e.settings.initinview && e.el.click(), e.settings.onLoad.call(t, e)
                };
            n.filter((function(t) {
                return t.settings.y < i
            })).forEach(a);
            var r, u, c, s, d = (r = function() {
                    m = f < window.pageYOffset, f = window.pageYOffset, m && n.filter((function(t) {
                        return t.settings.y < i + f && !1 === t.settings.initialized
                    })).forEach(a), 0 === o && window.removeEventListener("scroll", d, !1)
                }, u = e.debounce, function() {
                    var t = this,
                        e = arguments,
                        n = function() {
                            s = null, c || r.apply(t, e)
                        },
                        i = c && !s;
                    clearTimeout(s), s = setTimeout(n, u), i && r.apply(t, e)
                }),
                f = 0,
                m = !1;
            window.addEventListener("scroll", d, !1)
        }

        function c(t, i) {
            if (t.iframe = function(t) {
                    var e = document.createDocumentFragment(),
                        n = document.createElement("iframe");
                    t.vendor && (t.src = o.src[t.vendor](t));
                    n.setAttribute("id", "lazyframe-".concat(t.id)), n.setAttribute("src", t.src), n.setAttribute("frameborder", 0), n.setAttribute("allowfullscreen", ""), t.autoplay && (n.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture");
                    return e.appendChild(n), e
                }(t.settings), t.settings.thumbnail && i && (t.el.style.backgroundImage = "url(".concat(t.settings.thumbnail, ")")), t.settings.title && 0 === t.el.children.length) {
                var a = document.createDocumentFragment(),
                    r = document.createElement("span");
                r.className = "lazyframe__title", r.innerHTML = t.settings.title, a.appendChild(r), t.el.appendChild(a)
            }
            e.lazyload || (t.el.classList.add("lazyframe--loaded"), t.settings.onLoad.call(this, t), n.push(t)), t.settings.initialized || n.push(t)
        }
        return function(n) {
            if (e = t({}, i, arguments.length <= 1 ? void 0 : arguments[1]), "string" == typeof n)
                for (var o = document.querySelectorAll(n), r = 0; r < o.length; r++) a(o[r]);
            else if (void 0 === n.length) a(n);
            else
                for (var l = 0; l < n.length; l++) a(n[l]);
            e.lazyload && u()
        }
    }()
}));


function loadFBScript() {
    return new Promise((resolve, reject) => {
        var d = document;
        var s = 'script';
        var id = 'facebook-jssdk';
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/all.js#xfbml=1";
        js.async = true;
        js.onload = resolve;
        js.onerror = reject;
        fjs.parentNode.insertBefore(js, fjs);
    });
}

// Lazy implementation
function LazyInit() {
    lazyframe('.lazyframe');
    const youtubeContainers = document.querySelectorAll('.youtube-container');
    const videoTags = document.getElementsByTagName('video');
    const fbContainers = document.querySelectorAll('.fb-like');

    const lazyLoadYoutube = (videoContainer) => {
        const videoId = videoContainer.getAttribute('data-video-id');
        if (!videoId) {
            return;
        }

        const autoplay = videoContainer.getAttribute('data-autoplay') || '0';
        const controls = videoContainer.getAttribute('data-controls') || '1';
        const modestbranding = videoContainer.getAttribute('data-modestbranding') || '1';
        const rel = videoContainer.getAttribute('data-rel') || '0';
        const showinfo = videoContainer.getAttribute('data-showinfo') || '0';

        const queryParameters = new URLSearchParams({
            autoplay,
            controls,
            modestbranding,
            rel,
            showinfo
        }).toString();

        const videoEmbed = document.createElement('iframe');
        videoEmbed.setAttribute('src', `https://www.youtube.com/embed/${videoId}?${queryParameters}`);
        videoEmbed.setAttribute('frameborder', '0');
        videoEmbed.setAttribute('allowfullscreen', '');
        videoEmbed.setAttribute('width', '100%');
        videoEmbed.setAttribute('height', '100%');

        // if height is not defined, set it to a default value
        if (videoContainer.style.height === '') {
            const aspectRatio = 0.5625; // 16:9 aspect ratio
            const divHeight = videoContainer.offsetHeight || videoContainer.scrollHeight;
            //const divWidth = Math.ceil(divHeight / aspectRatio);

            //videoContainer.style.width = '${divWidth}px';
            videoContainer.style.height = '${divHeight}px';
        }

        const videoLink = videoContainer.querySelector('a');
        if (videoLink) {
            videoContainer.removeChild(videoLink);
        }

        videoContainer.appendChild(videoEmbed);
    };

    const lazyLoadVideo = (videoContainer) => {
        const autoplay = videoContainer.getAttribute('data-autoplay');
        if (!autoplay) {
            return;
        }
        videoContainer.setAttribute('autoplay', autoplay);
        videoContainer.play();
    };

    const lazyLoadFB = (fbContainer) => {
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.async = true;
            js.src = "https://connect.facebook.net/en_US/all.js#xfbml=1";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    };

    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    //if ('IntersectionObserver' in window)
    {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const videoContainer = entry.target;
                    lazyLoadYoutube(videoContainer);
                    observer.unobserve(videoContainer);
                }
            });
        }, options);

        const v_observer = new IntersectionObserver((entries, v_observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const videoContainer = entry.target;
                    lazyLoadVideo(videoContainer);
                    v_observer.unobserve(videoContainer);
                }
            });
        }, options);

        const fb_observer = new IntersectionObserver((entries, fb_observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const fbContainer = entry.target;
                    lazyLoadFB(fbContainer);
                    fb_observer.unobserve(fbContainer);
                    //loadFBScript();
                }
            });
        }, options);

        youtubeContainers.forEach((videoContainer) => {
            observer.observe(videoContainer);
        });
        for (let i = 0; i < videoTags.length; i++) {
            v_observer.observe(videoTags[i]);
        }
        fbContainers.forEach((fbContainer) => {
            fb_observer.observe(fbContainer);
        });
    }
    //else
    {
        // youtubeContainers.forEach((videoContainer) => {
        // lazyLoadYoutube(videoContainer);
        // });
        // for (let i = 0; i < videoTags.length; i++) {
        // lazyLoadVideo(videoTags[i]);
        // }
        // fbContainers.forEach((fbContainer) => {
        // lazyLoadFB(fbContainer);
        // });
    }
}

if (document.readyState !== 'loading') {
    LazyInit();
} else {
    document.addEventListener('DOMContentLoaded', LazyInit);
}