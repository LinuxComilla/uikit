import $ from 'jquery';
import {animationend, transitionend} from './env';

export const langDirection = $('html').attr('dir') == 'rtl' ? 'right' : 'left';

export function ready(fn) {

    var handle = function () {
        document.removeEventListener('DOMContentLoaded', handle);
        window.removeEventListener('load', handle);
        fn();
    };

    if (document.readyState === 'complete') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', handle);
        window.addEventListener('load', handle);
    }

}

export function transition(element, props, duration, transition) {

    var d = $.Deferred();

    element = $(element);

    for (var name in props) {
        element.css(name, element.css(name));
    }

    requestAnimationFrame(function () {
        element
            .on(transitionend, function () {
                d.resolve();
                element.css('transition', '');
            })
            .css('transition', `all ${duration}ms ${transition || 'linear'}`)
            .css(props);
    });

    return d.promise();
}

export function animate(element, animation, duration, out) {

    var d = $.Deferred(), cls = out ? 'uk-animation-leave' : 'uk-animation-enter';

    element = $(element);

    if (out && animation.indexOf('uk-animation-') === 0) {
        animation += ' uk-animation-reverse';
    }

    reset();

    element.css('animation-duration', duration + 'ms').addClass(animation);

    requestAnimationFrame(function () {
        element.addClass(cls);
    });

    element.one(animationend, function () {
        reset();
        d.resolve();
    });

    return d.promise();

    function reset() {
        element.css('animation-duration', '').removeClass(cls + ' ' + animation);
    }
}

export const Animation = {

    in: function (element, animation, duration) {
        return animate(element, animation, duration, false);
    },

    out: function (element, animation, duration) {
        return animate(element, animation, duration, true);
    },

    inProgress: function (element) {
        return $(element).hasClass('uk-animation-enter') || $(element).hasClass('uk-animation-leave');
    },

    cancel: function(element) {
        $(element).trigger(animationend);
    },

    transition: transition

};

export function offsetParent(element) {
    return $(element).parents().filter(function () {
        return $.inArray($(this).css('position'), ['relative', 'fixed', 'absolute']) !== -1;
    }).first();
}

export function isWithin(element, selector) {
    element = $(element);
    return element.is(selector) || !!(typeof selector === 'string' ? element.parents(selector).length : $.contains(selector instanceof $ ? selector[0] : selector, element[0]));
}
