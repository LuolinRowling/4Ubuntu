var s = require('subtitle-npm-module');

var contents = ['javascript?', 'python?', 'C++?', 'java?', 'perl?', 'ruby?', 'world!'];

var elem = document.getElementById('content');

var opts = {
	typeSpeed: 50,
	deleteSpeed: 20,
	pauseDelay: 2000,
	loop: false,
	postfix: ""
};

s.subtitle(elem, opts, contents);

