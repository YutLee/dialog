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
		
	var html;
	var $prompt,
		$wrapper,
		$dialog,
		$title,
		$content,
		$cancel,
		$ok,
		$close,
		$overlay;
	var isShow = false;
	
	function isFunction(variable) {
		return Object.prototype.toString.call(variable) === '[object Function]';
	}
	
	/**
	 * 初始化对话框
	 * @private
	 */
	function init() {
		if(!$wrapper) {
			$wrapper = $(html).appendTo('body');
			$dialog = $wrapper.prev('.modal-dialog');
			$title = $dialog.children('.dialog-title');
			$content = $dialog.children('.dialog-content');
			$cancel = $dialog.children('.dialog-button').children().first();
			$ok = $dialog.children('.dialog-button').children().last();
			$close = $dialog.children('.dialog-close');
			$overlay = $dialog.next('.modal-dialog-overlay');
		}
		$wrapper.hide();
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
		$dialog.css({'top': top, 'left': left});
		$wrapper.show();
	}
	
	/**
	 * 填充内容到对话框
	 * @private
	 */
	function addContent(msg, value) {
		if(value || value == '') {
			$content.empty().append('<div>' + msg + '</div>');
			$prompt = $('<input class="dialog-input" type="text" name="prompt" tabIndex="10000" value="' + value +'" />').appendTo($content);
		}else {
			$content.empty().text(msg);
		}
		position();
		isShow = true;
	}
	
	/**
	 * 隐藏对话框
	 * @private
	 */
	function hideDialog() {
		$wrapper.hide();
		$content.empty();
		unbind();
		isShow = false;
	}
	
	/**
	 * 取消绑定的事件
	 * @private
	 */
	function unbind() {
		$ok.unbind('click');
		$cancel.unbind('click');
		$close.unbind('click');
		$overlay.unbind('click');
		$(document).unbind('keydown.dialogEsc');
		$(document).unbind('keydown.dialogTab');
		$ok.unbind('keydown.dialogEnter');
		$cancel.unbind('keydown.dialogEnter');
	}
	
	/**
	 * 绑定 取消/关闭 按钮
	 * @private
	 */
	function bindConcel(el, cencel) {
		el.bind({
			'click': function() {
				hideDialog();
				if(isFunction(cencel)) {
					cencel.call(this);
				}
			}
		});
	}
	
	/**
	 * 绑定键盘事件
	 * @private
	 */
	function bindKeybord($ok, $close, $cancel, $prompt) {
		if($prompt) {
			$prompt.focus();
			$prompt.bind({
				'keydown': function(e) {
					if(e.keyCode === 13) {
						$ok.click();
					}
				}
			});
		} else{
			$ok.focus();
		}
		$(document).bind({
			'keydown.dialogEsc': function(e) {
				if(e.keyCode === 27) {
					$close.click();
				}
			},
			'keydown.dialogTab': function(e) {
				if(e.keyCode === 9) {
					if(!$cancel) {
						//$ok.focus();
					}
				}
			}
		});
		$ok.bind({
			'keydown.dialogEnter': function(e) {
				if(e.keyCode === 13) {
					$ok.click();
				}
			}
		});
		if($cancel) {
			$cancel.bind({
				'keydown.dialogEnter': function(e) {
					if(e.keyCode === 13) {
						$cancel.click();
					}
				}
			});
		}
	}
	
	
	/**
	 * 设置空函数
	 * @private
	 */
	function noop(fn) {
		if(!fn || !isFunction(fn)){
			fn = $.noop;
		}
		return fn;
	}
	
	/**
	 * tooltip 对象
	 * @namespace 
	 */
	app.dialog = {
		/**
		 * setup 全局设置
		 * @param {string} dialogClass 弹窗口类名
		 * @param {string} overlayClass 遮罩层类名
		 * @param {string} title 提示的标题
		 * @param {string} ok ok按钮的文本
		 * @param {string} cancel cancel按钮的文本
		 */
		setup: function(options) {
			var o = $.extend({
				dialogClass: '',
				overlayClass: '',
				title: '温馨提示',
				ok: '确定',
				cancel: '取消'
			}, options || {});
			
			html = $('<div class="modal-dialog ' + o.dialogClass +'"><div class="dialog-close">×</div><div class="dialog-title">' + o.title + '</div><div class="dialog-content"></div> <div class="dialog-button"><button class="play-button" tabIndex="10002">' + o.cancel + '</button> <button class="play-button" tabIndex="10001">' + o.ok + '</button></div></div><div class="modal-dialog-overlay ' + o.overlayClass +'"></div>');

		},
		/**
		 * alert 对话框
		 * @param {string} msg 需要显示的文本信息
		 */
		alert: function(msg) {
			if(isShow) {
				return false;
			}
			init();
			$cancel.hide();
			addContent(msg);
			$ok.bind({
				'click': function() {
					hideDialog();
				}
			});
			bindConcel($close);
			bindConcel($overlay);
			bindKeybord($ok, $close);
		},
		/**
		 * confirm 对话框
		 * @param {string} msg 需要显示的文本信息
		 * @param {Function} ok 确定时的回调函数
		 * @param {Function} cancel 取消时的回调函数
		 * @return {boolean} 确定时返回 true，取消时返回 false
		 */
		confirm: function(msg, ok, cancel) {
			if(isShow) {
				return false;
			}
			init();
			addContent(msg);
			ok = noop(ok);
			cancel = noop(cancel);
			$ok.bind({
				'click': function() {
					hideDialog();
					ok.call(this);
				}
			});
			bindConcel($cancel, cancel);
			bindConcel($close, cancel);
			bindConcel($overlay, cancel);
			bindKeybord($ok, $close, $cancel);
		},
		/**
		 * prompt 对话框
		 * @param {string} msg 需要显示的文本信息
		 * @param {string} value 用户输入的值
		 * @param {Function} ok 确定时的回调函数
		 * @param {Function} cancel 取消时的回调函数
		 * @return {boolean} 确定时返回 value，取消时返回 false
		 */
		prompt: function(msg, value, ok, cancel) {
			if(isShow) {
				return false;
			}
			var okFn, cancelFn;
			init();
			if(isFunction(value)) {
				addContent(msg, '');
				okFn = noop(value);
				cancelFn = noop(ok);	
			}else {
				addContent(msg, value);
				okFn = noop(ok);
				cancelFn = noop(cancel);
			}
			$ok.bind({
				'click': function() {
					hideDialog();
					var val = $prompt.val();
					okFn.call(this, val);
				}
			});
			bindConcel($cancel, cancelFn);
			bindConcel($close, cancelFn);
			bindConcel($overlay, cancelFn);
			bindKeybord($ok, $close, $cancel, $prompt);
		}
	};
	
	app.dialog.setup();
	
})(jQuery, window);