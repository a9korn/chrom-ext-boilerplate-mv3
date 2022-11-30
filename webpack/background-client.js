console.clear();
const env = require('./env');

const options = {
	protocol: 'http',
	host: env.HOST,
	port: env.PORT,
	path: `/${env.NAME}`,
};

const source = new EventSource(`${options.protocol}://${options.host}:${options.port}${options.path}`);
source.addEventListener('open', () => {
	console.log('[HOT-RELOAD] Connected to devServer.');
});
source.addEventListener('error', err => {
	console.log('[HOT-RELOAD] Failed to connect to devServer.', err);
});
source.addEventListener('message', event => {
	const data = JSON.parse(event.data);
	if (data.type === 'backgroundUpdates') {
		console.log('[HOT-RELOAD] Detected Background updates, reloading extension...');
		source.close();
		chrome.runtime.reload();
	} else if (data.type === 'contentScriptUpdates') {
		console.log('[HOT-RELOAD] Detected Content Script updates, reloading pages...');
		chrome.tabs.query({active: true}, tabs => {
			tabs.forEach(tab => {
				chrome.tabs.sendMessage(tab.id, {type: 'contentScriptUpdates'});
			});
			console.log('[HOT-RELOAD] Reloading extension...');
			source.close();
			chrome.runtime.reload();
		});
	}
});

