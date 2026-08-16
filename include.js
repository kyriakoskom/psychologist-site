// include-footer.js
async function includeFooter() {
  try {
    const response = await fetch('footer.html');
    if (!response.ok) {
      throw new Error('Failed to fetch footer.html');
    }
    const footerContent = await response.text();
    document.getElementById('footer').innerHTML = footerContent;
  } catch (error) {
    console.error('Error loading footer:', error);
  }
}

// Call the function when the page loads
window.addEventListener('DOMContentLoaded', includeFooter);