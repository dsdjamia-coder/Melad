// MeeladPulse Responsive Navigation Engine
import { auth } from "./firebase-init.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export function initializeNavigation() {
  // 1. Mobile Hamburger Menu Setup
  const hamburgerBtn = document.getElementById('mobile-hamburger-btn');
  const mobileNavMenu = document.getElementById('mobile-dropdown-menu');

  if (hamburgerBtn && mobileNavMenu) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      setMenuState(!isExpanded);
    });

    // Close when clicking any nav links inside the menu
    const navLinks = mobileNavMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        setMenuState(false);
      });
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        setMenuState(false);
      }
    });

    // Prevent close-on-click inside menu content
    mobileNavMenu.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Clicking anywhere else closes the mobile menu
    document.addEventListener('click', () => {
      setMenuState(false);
    });
  }

  function setMenuState(open) {
    if (!hamburgerBtn || !mobileNavMenu) return;
    
    if (open) {
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      mobileNavMenu.classList.remove('max-h-0', 'opacity-0', 'pointer-events-none');
      mobileNavMenu.classList.add('max-h-[85vh]', 'opacity-100');
    } else {
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      mobileNavMenu.classList.add('max-h-0', 'opacity-0', 'pointer-events-none');
      mobileNavMenu.classList.remove('max-h-[85vh]', 'opacity-100');
    }
  }

  // 2. Active Page Highlighting & Accordion expansion
  const currentPath = window.location.pathname;
  const allNavLinks = document.querySelectorAll('.nav-link-item');

  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (currentPath.endsWith(href) || currentPath.includes(href.replace('.html', '')))) {
      link.classList.add('bg-slate-100', 'text-slate-900', 'font-bold');
      
      // Auto expand parent group if it exists
      const parentGroup = link.closest('.nav-group-content');
      if (parentGroup) {
        parentGroup.classList.remove('hidden');
        const trigger = document.querySelector(`[aria-controls="${parentGroup.id}"]`);
        if (trigger) {
          trigger.setAttribute('aria-expanded', 'true');
        }
      }
    }
  });

  // 3. Dropdown Expanders (Sidebar groups)
  const groupTriggers = document.querySelectorAll('.nav-group-trigger');
  groupTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('aria-controls');
      const target = document.getElementById(targetId);
      if (target) {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
        target.classList.toggle('hidden');
      }
    });
  });

  // 4. Update dynamic user profile information
  updateProfileDetails();

  // 5. Logout Listener Bindings
  const logoutBtns = document.querySelectorAll('.logout-action-btn');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await signOut(auth);
        localStorage.removeItem('meeladpulse_selected_fest_id');
        localStorage.removeItem('meeladpulse_selected_fest_title');
        window.location.replace('/login.html');
      } catch (err) {
        console.error("Sign out process error:", err);
      }
    });
  });
}

function updateProfileDetails() {
  const profile = window.currentUserProfile;
  if (!profile) return;

  // Render profile name
  document.querySelectorAll('.user-profile-name').forEach(el => {
    el.textContent = profile.name || 'User Account';
  });

  // Render profile role display
  const rolesMap = {
    admin: 'Head Administrator',
    judge: 'Panel Judge Chief',
    teamLeader: 'Team Leader'
  };
  document.querySelectorAll('.user-profile-role').forEach(el => {
    let text = rolesMap[profile.role] || profile.role;
    if (profile.role === 'teamLeader' && profile.teamId) {
      text += ` (${profile.teamId})`;
    }
    el.textContent = text;
  });

  // Render festival name
  const festTitle = localStorage.getItem('meeladpulse_selected_fest_title') || 'No Festival Selected';
  document.querySelectorAll('.selected-festival-title').forEach(el => {
    el.textContent = festTitle;
  });
}
