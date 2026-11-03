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
    /* any surviving outbound link to the AC site or a mail capture */
    [].forEach.call(document.querySelectorAll('a[href]'), function (a) {
      var h = a.getAttribute('href') || '';
      if (/arthurcurtis\.com|mailto:|formsubmit/i.test(h)) {
        a.removeAttribute('href');
        a.style.cursor = 'default';
      }
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
