var m = require('malarkey');

var contents = [];

exports.subtitle = function(elem, opts, contents) {

	if (elem === undefined || contents === undefined) {
		console.error('Parameters can not be undefined.');
		return;
	}

	if  (contents.length == 0) {
		console.error('Empty subtitle content.');
		return;
	}

	var _def_opts_ = {
			typeSpeed: 50,
			deleteSpeed: 20,
			pauseDelay: 2000,
			loop: false,
			postfix: ""
		},
		_opts_ = opts || _def_opts_;


	var obj = m(elem, opts);

	if (contents.length == 0) return;

	for (var i = 0; i < contents.length - 1; i++) {
		obj.type(contents[i]).pause().delete();
	}

	obj.type(contents[contents.length - 1]).pause();
}
