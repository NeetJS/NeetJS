var demo_load_all = function () {
	$('.mainpanel').empty();
	$('.mainpanel').ntrender({
		'mod': 'org-neetjs-demo-allpage',
		'data': {
			'students': [
				{'id': '10001', 'name': 'Winston', 'mobile': '+xx xxxx-xxx-xxxx'},
				{'id': '10002', 'name': 'Reinhardt', 'mobile': '+xx xxxx-xxx-xxxx'},
				{'id': '10003', 'name': 'Anna', 'mobile': '+xx xxxx-xxx-xxxx'}
			],
			'staffs': []
		}
	});
};

var demo_load_student = function () {
	$('.mainpanel').empty();
	$('.mainpanel').ntrender({
		'mod': 'org-neetjs-demo-studentpage',
		'data': {
			'students': [
				{'id': '10001', 'name': 'Winston', 'mobile': '+xx xxxx-xxx-xxxx'},
				{'id': '10002', 'name': 'Reinhardt', 'mobile': '+xx xxxx-xxx-xxxx'},
				{'id': '10003', 'name': 'Anna', 'mobile': '+xx xxxx-xxx-xxxx'}
			]
		}
	});
};

var demo_load_staff = function () {
	$('.mainpanel').empty();
	$('.mainpanel').ntrender({
		'mod': 'org-neetjs-demo-staffpage',
		'data': {
			'students': [
				{'id': '10001', 'name': 'Winston', 'mobile': '+xx xxxx-xxx-xxxx'},
				{'id': '10002', 'name': 'Reinhardt', 'mobile': '+xx xxxx-xxx-xxxx'},
				{'id': '10003', 'name': 'Anna', 'mobile': '+xx xxxx-xxx-xxxx'}
			],
			'staffs': []
		}
	});
};

$(function () {
	$.neetjs.setDebug(true);
	$.neetjs.loadFromBody();
	demo_load_all();
});
