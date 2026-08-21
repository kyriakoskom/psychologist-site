// include-footer.js
window.footerReady = (async function includeFooter() {
  try {
    const response = await fetch('footer.html');
    if (!response.ok) {
      throw new Error('Failed to fetch footer.html');
    }
    const footerContent = await response.text();
    document.getElementById('site-footer').innerHTML = footerContent;
  } catch (error) {
    console.error('Error loading footer:', error);
  }
})();
