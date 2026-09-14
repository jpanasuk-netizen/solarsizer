/* Amazon Associates conversion CTA. Tag live. No income claims. */
(function () {
  "use strict";
  var AMAZON_TAG = "generatorsi0d-20";
  function amzUrl(q) {
    return "https://www.amazon.com/s?k=" + encodeURIComponent(q) +
           "&tag=" + encodeURIComponent(AMAZON_TAG);
  }

  function bandFor(kind, rec) {
    rec = Math.max(1, Math.round(rec || 0));
    if (kind === "inverter") {
      return { label: "Pure-sine inverter matched to your load",
        q: rec + " watt pure sine wave inverter", alt: "2000 watt pure sine wave inverter",
        primary: "Shop this inverter size on Amazon", secondary: "Popular 2,000 W inverters on Amazon" };
    }
    if (kind === "controller") {
      return { label: "Charge controller for your array",
        q: rec + " amp MPPT charge controller", alt: "40 amp MPPT charge controller",
        primary: "Shop this controller on Amazon", secondary: "40 A MPPT on Amazon" };
    }
    if (kind === "panels") {
      return { label: "Panels for your array plan",
        q: "100 watt solar panel", alt: "200 watt solar panel",
        primary: "Shop solar panels on Amazon", secondary: "200 W panels on Amazon" };
    }
    return { label: "Off-grid solar kit class for your array",
      q: rec + " watt off grid solar kit", alt: "1000 watt off grid solar kit",
      primary: "Shop this size on Amazon", secondary: "1,000 W+ kits on Amazon" };
  }

  function fillSticky(url, label) {
    var bar = document.getElementById("amzSticky");
    if (!bar) return;
    var link = document.getElementById("amzStickyLink");
    if (link) {
      link.href = url;
      link.textContent = label || "Shop on Amazon";
      link.setAttribute("rel", "sponsored nofollow noopener");
      link.target = "_blank";
    }
    bar.hidden = false;
    bar.setAttribute("aria-hidden", "false");
  }
  window.dismissAmzSticky = function () {
    var bar = document.getElementById("amzSticky");
    if (bar) { bar.hidden = true; bar.setAttribute("aria-hidden", "true"); }
    try { sessionStorage.setItem("amzStickyDismissed", "1"); } catch (e) {}
  };
  window.updateMatchedCTA = function (rec, kind) {
    kind = kind || "default";
    var box = document.getElementById("matchedCta");
    var band = bandFor(kind, rec);
    var url = amzUrl(band.q);
    var altUrl = amzUrl(band.alt);
    if (box) {
      box.innerHTML =
        '<p class="small"><b>Matched to your result:</b> ' + band.label + '</p>' +
        '<div class="affil-links" style="display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.5rem">' +
        '<a class="btn-amz btn-amz-primary" rel="sponsored nofollow noopener" target="_blank" href="' +
          url + '">' + band.primary + '</a>' +
        '<a class="btn-amz" rel="sponsored nofollow noopener" target="_blank" href="' +
          altUrl + '">' + band.secondary + '</a>' +
        '</div>';
      box.hidden = false;
    }
    try {
      if (sessionStorage.getItem("amzStickyDismissed") !== "1") fillSticky(url, band.primary);
    } catch (e) { fillSticky(url, band.primary); }
  };
})();
