const { zoom, lat, lng } = JSON.parse(
  decodeURIComponent(location.hash.replace("#", ""))
);

[
  [
    `https://www.openstreetmap.org/#map=${zoom}/${lat}/${lng}`,
    'View on OpenStreetMap',
  ],
  [
    `https://www.openstreetmap.org/edit#map=${zoom}/${lat}/${lng}`,
    "Edit on OpenStreetMap",
  ],
  [
    `https://wikishootme.toolforge.org/#lat=${lat}&lng=${lng}&zoom=${zoom}`,
    "WikiShootMe!",
  ],
  [
    `https://zelonewolf.github.io/openstreetmap-americana/#${zoom}/${lat}/${lng}`,
    "Americana",
  ],
  [
    `https://www.alltheplaces.xyz/map/#${zoom}/${lat}/${lng}`,
    "All The Places",
  ],
  [
    `https://www.strava.com/heatmap#${zoom}/${lng}/${lat}/hot/all`,
    "Strava Global Heatmap",
  ],
]
  .map(([href, textContent]) =>
    Object.assign(document.createElement("a"), {
      href,
      textContent,
      target: "_blank",
    })
  )
  .forEach((a) => {
    const p = document.createElement('p');
    p.append(a);
    document.body.append(p);
  });
