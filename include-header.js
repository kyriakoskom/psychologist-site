// // include-header.js
// async function includeHeader() {
//   try {
//     const response = await fetch('header.html');
//     if (!response.ok) {
//       throw new Error('Failed to fetch header.html');
//     }
//     const headerContent = await response.text();
//     document.getElementById('header').innerHTML = headerContent;
//   } catch (error) {
//     console.error('Error loading header:', error);
//   }
// }

// // Call the function when the page loads
// window.addEventListener('DOMContentLoaded', includeHeader);
// include-header.js
async function includeHeader() {
  try {
    const response = await fetch('header.html');
    if (!response.ok) {
      throw new Error('Failed to fetch header.html');
    }
    const headerContent = await response.text();
    document.getElementById('header').innerHTML = headerContent;

    // Get the current page's filename (e.g., "faq.html")
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

console.log('Current page:', currentPage); // Debugging line

    // Map filenames to data-page attributes
    const pageMap = {
      'index.html': 'home',
      'about.html': 'about',
      'services.html': 'services',
      'faq.html': 'faq',
      'contact.html': 'contact'
    };

    // Get the data-page value for the current page
    const currentDataPage = pageMap[currentPage] || 'home';

console.log('Current data-page:', currentDataPage); // Debugging line

    // Find the link with the matching data-page and add the 'active' class
    const navLinks = document.querySelectorAll('a[data-page]');
    navLinks.forEach(link => {
      if (link.getAttribute('data-page') === currentDataPage) {
        link.classList.add('active');
      }
    });
  } catch (error) {
    console.error('Error loading header:', error);
  }
}

// Call the function when the DOM is loaded
window.addEventListener('DOMContentLoaded', includeHeader);