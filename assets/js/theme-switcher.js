document.addEventListener('DOMContentLoaded', () => {
    // Initialize background animation
    initBackgroundAnimation();
    
    // Simulate boot sequence
    simulateBootSequence();
    
    // Theme switching for dropdown
    initLicenseDropdownTheme();
});

function initBackgroundAnimation() {
    const backgroundAnimation = document.querySelector('.background-animation');
    
    // Create gradient orbs
    const orbs = ['orb-1', 'orb-2', 'orb-3'];
    orbs.forEach(orbClass => {
        const orb = document.createElement('div');
        orb.className = `gradient-orb ${orbClass}`;
        backgroundAnimation.appendChild(orb);
    });
}

function simulateBootSequence() {
    const codeLines = document.querySelectorAll('.code-line');
    if (codeLines.length === 0) return;
    
    let delay = 0;
    codeLines.forEach((line, index) => {
        setTimeout(() => {
            line.style.opacity = '1';
            
            // Add typing effect
            const originalText = line.textContent;
            const text = originalText.replace('> ', '');
            line.textContent = '> ';
            let i = 0;
            const typing = setInterval(() => {
                if (i < text.length) {
                    line.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typing);
                }
            }, 50);
            
        }, delay);
        delay += 1500;
    });

    setTimeout(() => {
        document.body.classList.add("loaded");
        document.getElementById('license-page').classList.add("visible");
        
        // Show welcome notification
        showNotification('success', 'System Ready', 'License activation portal loaded successfully');
    }, 4500);
}

function initLicenseDropdownTheme() {
    const licenseType = document.getElementById('license-type');
    
    // When dropdown is focused/clicked, switch to white theme
    licenseType.addEventListener('focus', () => {
        document.body.classList.add('selecting-license');
    });
    
    // When dropdown loses focus, switch back to dark theme
    licenseType.addEventListener('blur', () => {
        setTimeout(() => {
            if (document.activeElement !== licenseType) {
                document.body.classList.remove('selecting-license');
            }
        }, 200);
    });
    
    // Also apply when clicking the dropdown
    licenseType.addEventListener('click', () => {
        document.body.classList.add('selecting-license');
    });
}

// Function to show notifications
function showNotification(type, title, message) {
    const notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon;
    switch(type) {
        case 'error':
            icon = '✖';
            break;
        case 'warning':
            icon = '⚠';
            break;
        case 'success':
            icon = '✓';
            break;
        default:
            icon = 'ℹ';
    }

    notification.innerHTML = `
        <span class="notification-icon">${icon}</span>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
    `;

    notificationContainer.appendChild(notification);

    // Remove notification after animation
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000);
}

// Corner logo interaction
document.querySelector('.corner-logo').addEventListener('click', () => {
    showNotification('info', 'Flash Sender', 'License Activation System v2.0.1 | Glassmorphism UI');
});