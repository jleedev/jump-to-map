const mapUrlRe = new RegExp(
	'#.*?(?<zoom>(\\d|\\.)+)/(?<lat>(-|\\d|\\.)+)/(?<lng>(-|\\d|\\.)+)'
);
const tileUrlRe = new RegExp(
	'/(?<z>\\d+)/(?<x>\\d+)/(?<y>\\d+)\\.png$'
);

chrome.runtime.onInstalled.addListener(() => {
	// Page actions are disabled by default and enabled on select tabs
	chrome.action.disable();
});


const locateMap = (url) => {
	const {hash, pathname} = new URL(url);
	let m = hash.match(mapUrlRe);
	if (m) {
		return m.groups;
	}
	const params = Object.fromEntries([...new URLSearchParams(hash.replace('#','?'))]);
	const {zoom, lat, lng} = params;
	if (zoom && lat && lng) {
		return {zoom, lat, lng};
	}
	m = pathname.match(tileUrlRe);
	if (m) {
		let {z, x, y} = m.groups;
		let lng = x / 2**z * 360 - 180;
		let n = Math.PI - 2 * Math.PI * y / 2**z;
		let lat = 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
		return {zoom: z, lat, lng};
	}
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	const result = locateMap(tab.url);
	const hasResult = !!result;
	if (hasResult) {
		const text = '°';
		const popup = `popup.html#${JSON.stringify(result)}`;
		await chrome.action.enable({ tabId });
		await chrome.action.setBadgeText({ text, tabId });
		await chrome.action.setPopup({ popup, tabId });
	} else {
		await chrome.action.disable({ tabId });
	}
});
