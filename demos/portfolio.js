/* Portfolio build — strips the Arthur Curtis funnel out of the shared tooling.
 *
 * These demos were written as part of AC's public tool suite, so they ship with
 * a cross-tool nav, a "Where to next?" spine and a FormSubmit-backed "Email my
 * results" capture. All of that is right on AC's own site and wrong here: this
 * page exists to show the work to someone considering hiring, not to recruit
 * them into a mailing list or send them off to another company's marketing.
 *
 * spine.js cannot simply be dropped, because the demos genuinely use AC.scenario
 * to hold state between inputs. So the state layer stays and only the outward
 * surface is disabled — mount and refresh become no-ops, and anything the spine
 * has already injected is removed.
 *
 * Loaded after spine.js and before each demo's own script.
 */
(function () {
  if (!window.AC) return;

  AC.spine = AC.spine || {};
  AC.spine.mount = function () {};
  AC.spine.refresh = function () {};

  /* if the spine self-mounted on load, take its DOM back out */
  function strip() {
    ['spine', 'spine-style', 'lnav', 'lnav-style'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.remove();
    });
    /* Any surviving outbound link to the AC site or a mail capture.
     *
     * The host matters as much as the domain: the AC site is published to
     * acgroup21.github.io/arthur-curtis-site/, so a pattern that only looked
     * for arthurcurtis.com left every "Get a plan" and "talk to us" link live
     * — the exact funnel this file exists to remove.
     *
     * A call-to-action button is deleted rather than deadened. Stripping the
     * href off a primary button leaves something that looks clickable and
     * isn't, which reads as a broken page; inline prose links degrade to
     * plain text without that problem. */
    var FUNNEL = /arthurcurtis\.com|arthur-curtis-site|mailto:|formsubmit/i;
    [].forEach.call(document.querySelectorAll('a[href]'), function (a) {
      if (!FUNNEL.test(a.getAttribute('href') || '')) return;
      if ((a.className || '').split(' ').indexOf('btn') > -1) { a.remove(); return; }
      a.replaceWith(document.createTextNode(a.textContent || ''));
    });
    /* og:url and canonical point search engines at AC's copy of the page */
    [].forEach.call(document.querySelectorAll('link[rel="canonical"],meta[property="og:url"]'),
      function (t) {
        var v = t.getAttribute('href') || t.getAttribute('content') || '';
        if (FUNNEL.test(v)) t.remove();
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', strip);
  } else {
    strip();
  }
  /* the spine can mount late, so sweep once more after the demo has run */
  setTimeout(strip, 400);
  setTimeout(strip, 1500);
})();
