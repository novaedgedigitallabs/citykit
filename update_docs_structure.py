import re

with open('docs.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update CSS
css_additions = """
    .doc-section { display: none; }
    .doc-section.active { display: block; }
    
    .sidebar-category { font-family: var(--font-mono); font-size: 11px; color: var(--text-3); letter-spacing: 1px; margin-bottom: 8px; padding: 0 24px; }
    .sidebar-link { display: block; padding: 8px 24px; font-size: 14px; color: var(--text-2); text-decoration: none; transition: 0.2s; border-left: 2px solid transparent; }
    .sidebar-link:hover { color: var(--text-1); }
    .sidebar-link.active { color: var(--lime); border-left-color: var(--lime); background: linear-gradient(90deg, rgba(163,255,0,0.05) 0%, transparent 100%); }
    .sidebar-section { margin-bottom: 24px; }
"""
html = html.replace('</style>', css_additions + '\n  </style>')

# 2. Replace Sidebar
sidebar_replacement = """
      <div class="sidebar-nav" id="sidebar-nav">
        <div class="sidebar-section">
          <div class="sidebar-category">GETTING STARTED</div>
          <a href="#introduction" class="sidebar-link" onclick="navigate('introduction')">Introduction</a>
          <a href="#installation" class="sidebar-link" onclick="navigate('installation')">Installation</a>
          <a href="#quick-start" class="sidebar-link" onclick="navigate('quick-start')">Quick Start</a>
          <a href="#typescript-support" class="sidebar-link" onclick="navigate('typescript-support')">TypeScript Support</a>
        </div>

        <div class="sidebar-section">
          <div class="sidebar-category">CORE CONCEPTS</div>
          <a href="#city-object" class="sidebar-link" onclick="navigate('city-object')">City Object</a>
          <a href="#full-vs-lite" class="sidebar-link" onclick="navigate('full-vs-lite')">Full vs Lite Dataset</a>
        </div>

        <div class="sidebar-section">
          <div class="sidebar-category">API REFERENCE</div>
          <a href="#api-overview" class="sidebar-link" onclick="navigate('api-overview')">Overview</a>
          <a href="#api-withinradius" class="sidebar-link" onclick="navigate('api-withinradius')">withinRadius()</a>
          <a href="#api-bycountry" class="sidebar-link" onclick="navigate('api-bycountry')">byCountry()</a>
          <a href="#api-bycontinent" class="sidebar-link" onclick="navigate('api-bycontinent')">byContinent()</a>
          <a href="#api-byadmin" class="sidebar-link" onclick="navigate('api-byadmin')">byAdmin()</a>
          <a href="#api-bypopulation" class="sidebar-link" onclick="navigate('api-bypopulation')">byPopulation()</a>
          <a href="#api-capitals" class="sidebar-link" onclick="navigate('api-capitals')">capitals()</a>
          <a href="#api-getcity" class="sidebar-link" onclick="navigate('api-getcity')">getCity()</a>
          <a href="#api-getbyiso2" class="sidebar-link" onclick="navigate('api-getbyiso2')">getByIso2()</a>
          <a href="#api-listcountries" class="sidebar-link" onclick="navigate('api-listcountries')">listCountries()</a>
          <a href="#api-random" class="sidebar-link" onclick="navigate('api-random')">random()</a>
          <a href="#api-stats" class="sidebar-link" onclick="navigate('api-stats')">stats()</a>
          <a href="#api-getcontinentnames" class="sidebar-link" onclick="navigate('api-getcontinentnames')">getContinentNames()</a>
        </div>

        <div class="sidebar-section">
          <div class="sidebar-category">RESOURCES</div>
          <a href="#changelog" class="sidebar-link" onclick="navigate('changelog')">Changelog</a>
        </div>
      </div>
"""
html = re.sub(r'<div class="sidebar-nav" id="sidebar-nav">.*?</div>\s*</aside>', sidebar_replacement + '    </aside>', html, flags=re.DOTALL)

# 3. Modify Sections (change `<section id="..." class="doc-section" style="display: none;">` to just class, and introduction to active)
html = re.sub(r'<section id="([^"]+)" class="doc-section"[^>]*>', r'<section id="\1" class="doc-section">', html)
html = html.replace('<section id="introduction" class="doc-section">', '<section id="introduction" class="doc-section active">')

# 4. Replace JS
js_replacement = """
  <script>
    function navigate(sectionId) {
      // 1. Hide all sections
      const sections = document.querySelectorAll('.doc-section');
      sections.forEach(sec => sec.classList.remove('active'));

      // 2. Show target section
      const target = document.getElementById(sectionId);
      if (target) {
        target.classList.add('active');
      }

      // 3. Update sidebar active state
      const links = document.querySelectorAll('.sidebar-link');
      links.forEach(link => link.classList.remove('active'));
      
      // Find link matching the href or the onclick argument
      const activeLink = document.querySelector(`.sidebar-link[href="#${sectionId}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }

      // 4. Update URL hash without jumping (optional smooth behavior)
      if(history.pushState) {
          history.pushState(null, null, `#${sectionId}`);
      } else {
          window.location.hash = sectionId;
      }
      
      // 5. Scroll to top
      window.scrollTo(0,0);
    }

    // Handle direct links on load
    window.addEventListener('DOMContentLoaded', () => {
      const hash = window.location.hash.substring(1);
      if (hash && document.getElementById(hash)) {
        navigate(hash);
      } else {
        navigate('introduction');
      }
      
      // Setup TOC scroll spy
      const activeSec = document.querySelector('.doc-section.active');
      if (activeSec) buildTOC(activeSec);
    });

    const tocLinks = document.getElementById('toc-links');
    function buildTOC(activeSec) {
      if (!activeSec) return;
      const headings = activeSec.querySelectorAll('h2.section-title, h3');
      let html = '';
      headings.forEach((heading, idx) => {
        const id = activeSec.id + '-heading-' + idx;
        heading.id = id;
        html += `<a class="toc-link" href="#${id}">${heading.innerText}</a>`;
      });
      if (tocLinks) tocLinks.innerHTML = html;
      setupScrollSpy(activeSec);
    }

    function setupScrollSpy(activeSec) {
      const links = document.querySelectorAll('.toc-link');
      const headings = activeSec.querySelectorAll('h2.section-title, h3');
      
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            links.forEach(l => l.classList.remove('active'));
            const activeLink = document.querySelector(`.toc-link[href="#${entry.target.id}"]`);
            if (activeLink) activeLink.classList.add('active');
          }
        });
      }, { rootMargin: '0px 0px -80% 0px' });

      headings.forEach(h => observer.observe(h));
    }

    // Copy to clipboard
    window.copyCode = function(button) {
      const pre = button.parentElement.nextElementSibling;
      const text = pre.innerText;
      navigator.clipboard.writeText(text).then(() => {
        const originalText = button.innerText;
        button.innerText = 'Copied!';
        setTimeout(() => button.innerText = originalText, 2000);
      });
    };

    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    if (hamburger) {
      hamburger.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }

    // Override hashchange to also trigger navigate
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.substring(1);
      // To handle TOC links vs section links:
      if (hash.includes('-heading-')) return; // ignore TOC jumps
      if (hash && document.getElementById(hash)) {
        navigate(hash);
        const activeSec = document.getElementById(hash);
        if (activeSec) buildTOC(activeSec);
      }
    });
  </script>
</body>
"""

html = re.sub(r'<script>.*</body>', js_replacement, html, flags=re.DOTALL)

with open('docs.html', 'w', encoding='utf-8') as f:
    f.write(html)
