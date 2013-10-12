/**
 * jQuery dialog -- alert, confirm, prompt
 * @license Copyright 2013
 * 
 * @author yutlee.cn@gmail.com
 * Date 2013-10-12 
 */
(function($, window, undefined) {
	'use strict';
	
	var  
		/** 
		 * 应用程序 
		 * @namespace 
		 */
		app = window.app = window.app || {};
		
	var html = $('<div class="modal-dialog"><div class="dialog-title">模态对话框</div><div class="dialog-content"></div> <div class="dialog-button"><div class="play-button">取消</div> <div class="play-button">确定</div></div></div><div class="modal-dialog-overlay"></div>');
	var $wrapper,
		$dialog,
		$title,
		$content,
		$cancel,
		$ok,
		$overlay;
	
	/**
	 * 初始化对话框
	 * @private
	 */
	function init() {
		if(!$wrapper) {
			$wrapper = $(html).appendTo('body');
			$dialog = $wrapper.children('.modal-dialog'),
			$title = $dialog.children('.dialog-title');
			$content = $dialog.children('.dialog-content');
			$cancel = $dialog.children('.dialog-button').children().first();
			$ok = $dialog.children('.dialog-button').children().last();
			$overlay = $wrapper.children('.modal-dialog-overlay');
		}
		$cancel.show();
	}
	
	/**
	 * 对话框定位
	 * @private
	 */
	function position() {
		var w = $(window).width(),
			h = $(window).height(),
			dW = $dialog.outerWidth(),
			dH = $dialog.outerHeight(),
			left = (w - dW) * .5,
			top = (h - dH) * .5;
		$dialog.css({'top': top, 'left': left, 'display': 'block'});
	}
	
	/**
	 * 填充内容到对话框
	 * @private
	 */
	function addContent(msg, value) {
		if(value) {
			
		}else {
			$content.empty().text(msg);
		}
		position();
	}

	
	/**
	 * tooltip 对象
	 * @namespace 
	 */
	app.dialog = {
		/**
		 * setup 全局设置
		 * @param {string} title 需要显示的文本信息
		 */
		setup: function(option) {
			
		},
		/**
		 * alert 对话框
		 * @param {string} msg 需要显示的文本信息
		 */
		alert: function(msg) {
			init();
			$cancel.hide();
			addContent(msg);
			$ok.bind({
				'click.alert': function() {
					$dialog.hide();
					$content.empty();
				}
			});
		},
		/**
		 * confirm 对话框
		 * @param {string} msg 需要显示的文本信息
		 * @return {boolean} 确定时返回 true，取消时返回 false
		 */
		confirm: function(msg) {
			init();
			addContent(msg);
			return false;
		},
		/**
		 * prompt 对话框
		 * @param {string} msg 需要显示的文本信息
		 * @param {string} value 用户输入的值
		 * @return {boolean} 确定时返回 value，取消时返回 false
		 */
		prompt: function(msg, value) {
			init();
			return value;
		}
	};
		
})(jQuery, window);