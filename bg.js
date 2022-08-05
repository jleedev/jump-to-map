// Detect if url hash is in the form zoom/lon/lat
// Which is less conventional
const willHaveLonLatRe = new RegExp(
  'https://www\\.strava\\.com/heatmap'
);
// Detect zoom/lat/lng from most sites
const mapUrlRe = new RegExp(
  '#.*?(?<zoom>(\\d|\\.)+)/(?<lat>(-|\\d|\\.)+)/(?<lng>(-|\\d|\\.)+)'
);
// Detect z/x/y from tile urls
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
  let isLngLat = url.match(willHaveLonLatRe);
  if (m) {
    if (isLngLat) {
      const { zoom, lat, lng } = m.groups;
      return { zoom, lat: lng, lng: lat };
    }
    return m.groups;
  }
  const params = Object.fromEntries([...new URLSearchParams(hash.replace('#','?'))]);
  const {zoom, lat, lng, lon} = params;
  if (zoom && lat && lng) {
    return {zoom, lat, lng};
  }
  if (zoom && lat && lon) {
    return {zoom, lat, lng: lon};
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
