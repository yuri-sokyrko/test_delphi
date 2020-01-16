import $ from 'jquery';

export function handler() {	
	let height_footer = $('footer').height();	
	let height_header = $('header').height();		
	//$('.content').css({'padding-bottom':height_footer+40, 'padding-top':height_header+40});
	
	
	let viewport_wid = viewport().width;
	let viewport_height = viewport().height;
	
	if (viewport_wid <= 991) {
		
	}
}

/* viewport width */
export function viewport(){
	var e = window, 
		a = 'inner';
	if ( !( 'innerWidth' in window ) )
	{
		a = 'client';
		e = document.documentElement || document.body;
	}
	return { width : e[ a+'Width' ] , height : e[ a+'Height' ] }
}
/* viewport width */