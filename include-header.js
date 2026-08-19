// include-header.js
window.headerReady = (async function includeHeader() {
  try {
    const response = await fetch('header.html');
    if (!response.ok) {
      throw new Error('Failed to fetch header.html');
    }
    const headerContent = await response.text();
    document.getElementById('header').innerHTML = headerContent;
console.log('Header content injected successfully.' + headerContent);
    // Work out which page we're on — handles "/", "/contact",
    // "/contact.html" and "/contact/" all the same way.
    let path = window.location.pathname;
    if (path.endsWith('/')) path = path.slice(0, -1);
    let currentPage = (path.split('/').pop() || 'index').replace(/\.html$/, '');
    if (currentPage === '') currentPage = 'index';

    // Map filenames to data-page attributes
    const pageMap = {
      index: 'home',
      about: 'about',
      services: 'services',
      faq: 'faq',
      contact: 'contact'
    };
    const currentDataPage = pageMap[currentPage] || 'home';

    // Find the link with the matching data-page and add the 'active' class
    document.querySelectorAll('a[data-page]').forEach(function (link) {
      if (link.getAttribute('data-page') === currentDataPage) {
        link.classList.add('active');
      }
    });
  } catch (error) {
    console.error('Error loading header:', error);
  }
})();
