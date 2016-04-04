Reveal.initialize({
	controls: true,
	//progress: true,
	keyboard: true,
	center: true, 
	history: true,
	dependencies: [
	{ src: 'reveal/lib/js/classList.js', condition: function() { return !document.body.classList; } },
	{ src: 'reveal/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
	{ src: 'reveal/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
	{ src: 'reveal/plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
	{ src: 'reveal/plugin/math/math.js', async: true }
	] 
});