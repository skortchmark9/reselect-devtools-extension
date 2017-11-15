const callback = (panel) => console.log('created panel');
chrome.devtools.panels.create(
	"Reselect", "does_not_matter.png", "panel.html", callback
);