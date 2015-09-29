$(document).ready( function() {
  // Stick the #nav to the top of the window
    var $nav = $('#sidebar');
    $nav.css({
        position: 'fixed',
        top: 0,
        left: $nav.offset().left,
        width: $nav.width(),
    });

    $.localScroll({filter : '.smoothScroll'});


    //Make the list of tags.
    var stacks = {}
    $('.stack-item').each(function(idx, elt) {
        var type = elt.className.replace('stack-item ', '')

        if (stacks[type] ||  stacks[type] === 0) {
            stacks[type] += 1;
        } else {
            stacks[type] = 1;
        }
    });

    for ( var key in stacks) {
        var $div = $('<div class=' + key + '>' + key.replace('stack-', '') + ' ' + stacks[key] + '</div>');
        $('.stats').append($div);
    }


});
