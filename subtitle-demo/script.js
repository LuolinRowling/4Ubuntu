//var m = require('malarkey');
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

// var obj = m(elem, opts);

// if (contents.length == 0) return;

// for (var i = 0; i < contents.length - 1; i++) {
// 	obj.type(contents[i]).pause().delete();
// }

// obj.type(contents[contents.length - 1]).pause();

//m(elem, opts).type('hello').pause().delete().type('hello2').pause().delete();
