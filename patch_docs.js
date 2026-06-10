const fs = require('fs');

let content = fs.readFileSync('docs.html', 'utf8');
const staticSections = fs.readFileSync('static_sections.html', 'utf8');

// Replace the hardcoded introduction inside <main> with the new static sections
const mainRegex = /<main class="main-content" id="main-content">[\s\S]*?<\/main>/;
content = content.replace(mainRegex, `<main class="main-content" id="main-content">\n${staticSections}\n    </main>`);

// Remove the `pages` object
const pagesRegex = /\/\/ --- CONTENT DATA ---[\s\S]*?const pages = \{[\s\S]*?\n    \};\n/;
content = content.replace(pagesRegex, '');

// Update the render logic
const logicRegex = /\/\/ --- RENDER LOGIC ---[\s\S]*?\/\/ Init\n    renderPage\(\);\n/;
const newLogic = `// --- RENDER LOGIC ---
    const sidebarNav = document.getElementById('sidebar-nav');
    const mainContent = document.getElementById('main-content');
    const tocLinks = document.getElementById('toc-links');
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');

    function buildTOC(activeSec) {
      if (!activeSec) return;
      const headings = activeSec.querySelectorAll('h2.section-title, h3');
      let html = '';
      headings.forEach((heading, idx) => {
        const id = activeSec.id + '-heading-' + idx;
        heading.id = id;
        html += \`<a class="toc-link" href="#\${id}">\${heading.innerText}</a>\`;
      });
      tocLinks.innerHTML = html;
      setupScrollSpy(activeSec);
    }

    function setupScrollSpy(activeSec) {
      const links = document.querySelectorAll('.toc-link');
      const headings = activeSec.querySelectorAll('h2.section-title, h3');
      
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            links.forEach(l => l.classList.remove('active'));
            const activeLink = document.querySelector(\`.toc-link[href="#\${entry.target.id}"]\`);
            if (activeLink) activeLink.classList.add('active');
          }
        });
      }, { rootMargin: '0px 0px -80% 0px' });

      headings.forEach(h => observer.observe(h));
    }

    function renderPage() {
      // Allow hash to contain sub-anchors if we implemented them, but mostly it's the section
      let hash = window.location.hash.replace('#', '');
      
      // Check if hash matches an anchor inside a section (e.g. #api-search-heading-0)
      let targetSectionId = hash;
      const subHeadingMatch = hash.match(/(.*)-heading-\\d+/);
      if (subHeadingMatch) {
          targetSectionId = subHeadingMatch[1];
      }
      
      const targetSec = document.getElementById(targetSectionId);
      if (!targetSec || !targetSec.classList.contains('doc-section')) {
          targetSectionId = 'introduction';
      }

      // Hide all sections
      document.querySelectorAll('.doc-section').forEach(sec => sec.style.display = 'none');
      
      const activeSec = document.getElementById(targetSectionId);
      if (activeSec) {
          activeSec.style.display = 'block';
      }

      // Update sidebar active state
      document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
      const activeNav = document.getElementById('nav-' + targetSectionId);
      if (activeNav) activeNav.classList.add('active');

      buildTOC(activeSec);

      // If we are just switching sections, scroll to top. If we are targeting a subheading, native jump handles it?
      // Native jump might be intercepted or happen before display='block', so let's do it manually if needed.
      if (subHeadingMatch && hash) {
          const heading = document.getElementById(hash);
          if (heading) heading.scrollIntoView();
      } else {
          window.scrollTo(0, 0);
      }

      // Close sidebar on mobile
      sidebar.classList.remove('open');
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

    // Mobile sidebar toggle
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });

    window.addEventListener('hashchange', renderPage);
    
    // Init
    renderPage();
`;

content = content.replace(logicRegex, newLogic);

fs.writeFileSync('docs.html', content);
console.log("docs.html patched");
