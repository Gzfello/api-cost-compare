// ============================================
// PRO ACCESS SYSTEM — Insert BEFORE closing </script> in index.html
// ============================================

// 1. URL PRO DETECTION
function isProUser() {
  const params = new URLSearchParams(window.location.search);
  const pro = params.get('pro');
  const token = params.get('token');
  
  // Pro access via URL parameters (manual activation)
  if (pro === '1' && token) {
    return true;
  }
  
  // Check localStorage (persistent after first activation)
  const stored = localStorage.getItem('pro_active');
  if (stored === 'true') {
    return true;
  }
  
  return false;
}

// 2. ACTIVATE PRO (call this when user sends email with link)
function activatePro(token) {
  localStorage.setItem('pro_active', 'true');
  localStorage.setItem('pro_token', token);
  localStorage.setItem('pro_date', new Date().toISOString());
  window.location.href = window.location.href.split('?')[0] + '?pro=1&token=' + token;
}

// 3. HIDE PRO FEATURES IF NOT PRO
function applyProUI() {
  const pro = isProUser();
  
  if (!pro) {
    // Hide Pro-only elements
    document.querySelectorAll('[data-pro-only]').forEach(el => {
      el.style.display = 'none';
    });
    
    // Show Pro banner
    const banner = document.getElementById('proBanner');
    if (banner) banner.style.display = 'block';
    
    // Disable Pro buttons (add visual indicator)
    document.querySelectorAll('[data-pro-btn]').forEach(btn => {
      btn.style.opacity = '0.5';
      btn.style.cursor = 'not-allowed';
      btn.title = 'API Cost Compare Pro required';
      btn.addEventListener('click', (e) => {
        if (!isProUser()) {
          e.preventDefault();
          alert('This feature requires Pro. Get it at https://vpsnkn.gumroad.com/vknrvf');
        }
      });
    });
    
    console.log('Free tier active');
  } else {
    // Pro user — show everything
    const banner = document.getElementById('proBanner');
    if (banner) banner.style.display = 'none';
    
    console.log('Pro tier active — all features unlocked');
  }
  
  return pro;
}

// 4. EMAIL TEMPLATE (for manual activation emails)
// Copy this text when you need to send access email:
/*
Subject: Your API Cost Compare Pro is active

Hi,

Your subscription to API Cost Compare Pro is now active.

Access your Pro features here:
https://Gzfello.github.io/api-cost-compare/

If the page asks to activate, click "Activate Pro" (you may need to refresh).

Pro features included:
- Price alerts (email + browser notifications)
- Historical price charts (30 days)
- Batch comparison (10+ APIs)
- Export data (CSV, JSON)
- Advanced filters

Questions? Reply to this email.

— API Cost Compare Team
*/

// 5. ACTIVATE ON PAGE LOAD
document.addEventListener('DOMContentLoaded', function() {
  const pro = applyProUI();
  
  if (pro) {
    // Initialize Pro features
    if (typeof initAdvancedFeatures === 'function') {
      initAdvancedFeatures();
    }
    
    // Request notification permission (Pro feature)
    if ('Notification' in window && Notification.permission === 'default') {
      setTimeout(() => Notification.requestPermission(), 5000);
    }
  }
});

// 6. PRO ACTIVATION BUTTON (add this HTML somewhere visible for users)
/*
<div id="proActivate" style="text-align:center; margin:20px 0;">
  <h3>🔒 Unlock Pro Features</h3>
  <p>Enter your activation token (from your Gumroad receipt email):</p>
  <input type="text" id="proToken" placeholder="Token from your email..." style="padding:10px; width:250px; background:#1a1a2e; color:#e0e0e0; border:1px solid #333; border-radius:6px">
  <button onclick="activatePro(document.getElementById('proToken').value)" style="background:linear-gradient(90deg,#00d4ff,#7b2ff7); color:white; border:none; padding:10px 20px; border-radius:6px; cursor:pointer; margin-left:5px;">Activate Pro</button>
</div>
*/

// 7. CHECK PRO STATUS (for debugging)
// Open browser console and type: checkProStatus()
window.checkProStatus = function() {
  const pro = isProUser();
  const token = localStorage.getItem('pro_token');
  const date = localStorage.getItem('pro_date');
  return {
    isPro: pro,
    token: token,
    activatedAt: date,
    bannerVisible: document.getElementById('proBanner')?.style.display !== 'none'
  };
};