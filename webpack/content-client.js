console.clear();
chrome.runtime.onMessage.addListener(message => {
	if (message.type === 'contentScriptUpdates') {
		console.log('[HOT-RELOAD] Detected content script updates, reloading pages...');
		// Wait until extension is reloaded
		setTimeout(() => {
			window.location.reload();
		}, 1000);
	}
});
console.log('[HOT-RELOAD] Started to listen for content script updates.');
