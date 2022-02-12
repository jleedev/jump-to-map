const {zoom, lat, lng} = JSON.parse(decodeURIComponent(location.hash.replace('#','')));
let a = document.createElement('a');
a.href = `https://www.openstreetmap.org/edit#map=${zoom}/${lat}/${lng}`;
a.textContent = 'Edit on OpenStreetMap';
a.target = '_blank';
document.body.append(a);
