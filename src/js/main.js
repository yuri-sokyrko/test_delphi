/**
 * External libs
 */
import $ from 'jquery';
import 'core-js/features/promise';

/**
 * Custom libs and functions
 */
import {handler} from './handler.js';
import {viewport} from './handler.js';

var startWindowScroll = 0;

$(window).on('load', function(){
	if(/iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
		$('body').addClass('mobos ios');
	} else if(/Android|webOS|BlackBerry/i.test(navigator.userAgent)) {
		$('body').addClass('mobos');
	} else {
		$('body').addClass('web');
	}
	$('body').removeClass('loaded');

	handler();
});

$(document).ready(function(){
	/* placeholder*/	   
	$('input, textarea').each(function(){
 		var placeholder = $(this).attr('placeholder');
 		$(this).focus(function(){ $(this).attr('placeholder', '');});
 		$(this).focusout(function(){			 
 			$(this).attr('placeholder', placeholder);  			
 		});
 	});
	/* placeholder*/
	
	/* components */

	// Make Nav work & text change
	if($('.js-header-nav__list').length) {
		let nav     =  $('.js-header-nav__list'),
			navLink = nav.find('a'),
			navItems = nav.find('li');

		navItems.eq(0).addClass('active');

		if($('.js-header-status__text').length) {
			$('.js-header-status__text').text(nav.find('li.active a').text());
		}

		navLink.click(function(e) {
			e.preventDefault();

			let text = $(this).text();

			navItems.removeClass('active');
			$(this).parent('li').addClass('active');
			$(this).parent('li').find('.sub-menu li').removeClass('active');

			if($('.js-header-status__text').length) {
				$('.js-header-status__text').text(text);
			}
		});
	}

	// Upload tabs content
	if($('.js-section-tabs').length) {
		let tabs        = $('.js-section-tabs').find('.tabs'),
			tabsButtons = tabs.find('.tabs__button'),
			tabsBody    = tabs.find('.tabs__body');

		let json_url = 'https://jsonplaceholder.typicode.com/posts/';

		for(let i = 0; i < tabsButtons.length; i++) {
			tabsButtons.eq(i).attr('data-id', i + 1);
		}
		tabsButtons.eq(0).addClass('active');
		
		$.getJSON(json_url + 1, function (data) {
			tabsBody.find('.tabs__title').text(data.title);
			tabsBody.find('.tabs__text').text(data.body);
		});

		tabsButtons.click(function(e) {
			e.preventDefault();

			tabsButtons.removeClass('active');
			$(this).addClass('active');
			
			$.getJSON(json_url + $(this).attr('data-id'), function (data) {
				tabsBody.find('.tabs__title').text(data.title);
				tabsBody.find('.tabs__text').text(data.body);
			});
		});
	}

	// Collors swapping
	if($('.js-section-boxes').length) {
		let colors = ["abc9ff", "d8ffbc", "fff68d", "ffbfbf", "b9fff4"];

		let boxes      = $('.js-section-boxes'),
			boxesItems = boxes.find('.section-boxes__item');

		for(let i = 0; i < colors.length; i++) {
			boxesItems.eq(i).css({'background-color': "#" + colors[i]});
			boxesItems.eq(i).attr('data-bgc', colors[i]);
		}

		boxesItems.click(function(e) {
			e.preventDefault();
			
			let swap = collorSwap(colors);

			for(let i = 0; i < swap.length; i++) {
				boxesItems.eq(i).css({'background-color': "#" + swap[i]});
				boxesItems.eq(i).attr('data-bgc', swap[i]);
			}
		});
	}
});

function collorSwap(colors) {
	let j, tmp;
	
	for(let i = colors.length - 1; i > 0; i--) {

		j = Math.floor( Math.random() * (i));

		tmp = colors[j];
		colors[j] = colors[i];
		colors[i] = tmp;
	}

	return colors;
}