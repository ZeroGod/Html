"use strict";

//label 模拟 radio
var label = $(".check_box label");
$('.check_box label').click(function() {
	var radioId = $(this).attr('name');
	label.removeAttr('class') && $(this).attr('class', 'active');
	$('input[type="radio"]').removeAttr('checked') && $('#' + radioId).attr('checked', 'checked');
});