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
