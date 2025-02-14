
// Function to create and position overlay
const createOverlay = (widget: Element) => {
  const overlay = document.createElement('div');
  overlay.id = 'n4r-overlay';
  overlay.style.cssText = `
    position: fixed;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 20px;
    z-index: 999999;
    font-family: system-ui;
  `;
  
  // Get widget position and size
  const rect = widget.getBoundingClientRect();
  overlay.style.top = `${rect.top}px`;
  overlay.style.left = `${rect.left}px`;
  overlay.style.width = `${rect.width}px`;
  overlay.style.height = `${rect.height}px`;
  
  overlay.innerHTML = `
    <div style="height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
      <h3 style="margin: 0; padding: 10px;">Wallet Connected</h3>
      <p style="margin: 10px 0;">Balance: 100 MATIC</p>
      <button onclick="document.getElementById('n4r-overlay').remove()" 
              style="padding: 8px 16px; background: #64B5F6; border: none; color: white; border-radius: 4px; cursor: pointer;">
        Close
      </button>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // Log success
  console.log('Successfully overlaid Now4real widget!');
};

// Observer to detect widget
const observer = new MutationObserver((mutations) => {
  const widget = document.querySelector('[data-now4real-widget]');
  if (widget) {
    console.log('Now4real widget detected!');
    createOverlay(widget);
    observer.disconnect();
  }
});

// Start observing
export const initNow4realTest = () => {
  console.log('Starting Now4real widget detection...');
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
};
