/**
 * Responsive menu.
 */

// RequireJS: Define JS dependencies
define(['jquery'], function () {

	function init(){
	  $('#toggle-responsive-menu').click(function() {
	    if($('header nav').is(':visible')){
	      $('header nav').slideUp('fast');
	    }
	    else{
	       $('header nav').slideDown('fast');
	    }
	    $(this).find('span').toggleClass('on');

	    // Don't trigger default action
	    event.preventDefault();
	  });
	}

	init();

});
