// include-header.js
async function includeHeader() {
  try {
    const response = await fetch('header.html');
    if (!response.ok) {
      throw new Error('Failed to fetch header.html');
    }
    const headerContent = await response.text();
    document.getElementById('header').innerHTML = headerContent;
  } catch (error) {
    console.error('Error loading header:', error);
  }
}

// Call the function when the page loads
window.addEventListener('DOMContentLoaded', includeHeader);