document.addEventListener('DOMContentLoaded', () => {
    const licenseType = document.getElementById('license-type');
    const dropdownOverlay = document.querySelector('.dropdown-overlay');
    const body = document.body;
    
    // Create white theme dropdown modal
    const whiteThemeModal = document.createElement('div');
    whiteThemeModal.className = 'dropdown-white-theme';
    whiteThemeModal.innerHTML = `
        <button class="close-btn">×</button>
        <div class="license-list">
            <h3>SELECT LICENSE TYPE</h3>
            <div class="license-options">
                <div class="license-option" data-value="demo-license">
                    <h4>DEMO VERSION</h4>
                    <div class="price">FREE</div>
                    <div class="duration">For Testing Only</div>
                    <ul class="features">
                        <li>Limited Functionality</li>
                        <li>No Real Transactions</li>
                        <li>For Preview Only</li>
                    </ul>
                </div>
                <div class="license-option" data-value="7days-license">
                    <h4>7 DAYS TRIAL</h4>
                    <div class="price">$9.99</div>
                    <div class="duration">7 Days Access</div>
                    <ul class="features">
                        <li>Full Access for 7 Days</li>
                        <li>Basic Support</li>
                        <li>All Features Enabled</li>
                    </ul>
                </div>
                <div class="license-option" data-value="1month-license">
                    <h4>1 MONTH</h4>
                    <div class="price">$29.99</div>
                    <div class="duration">30 Days Access</div>
                    <ul class="features">
                        <li>Full Access for 30 Days</li>
                        <li>Priority Support</li>
                        <li>Regular Updates</li>
                    </ul>
                </div>
                <div class="license-option" data-value="3months-license">
                    <h4>3 MONTHS</h4>
                    <div class="price">$79.99</div>
                    <div class="duration">90 Days Access</div>
                    <ul class="features">
                        <li>3 Months Full Access</li>
                        <li>Priority Support</li>
                        <li>Save 20%</li>
                    </ul>
                </div>
                <div class="license-option" data-value="6months-license">
                    <h4>BASIC 6 MONTHS</h4>
                    <div class="price">$149.99</div>
                    <div class="duration">180 Days Access</div>
                    <ul class="features">
                        <li>6 Months Full Access</li>
                        <li>24/7 Support</li>
                        <li>Save 30%</li>
                    </ul>
                </div>
                <div class="license-option" data-value="1year-license">
                    <h4>BASIC 1 YEAR</h4>
                    <div class="price">$249.99</div>
                    <div class="duration">365 Days Access</div>
                    <ul class="features">
                        <li>1 Year Full Access</li>
                        <li>24/7 Premium Support</li>
                        <li>Save 40%</li>
                    </ul>
                </div>
                <div class="license-option" data-value="Premium-license">
                    <h4>PREMIUM LIFETIME</h4>
                    <div class="price">$499.99</div>
                    <div class="duration">Lifetime Access</div>
                    <ul class="features">
                        <li>Lifetime Full Access</li>
                        <li>24/7 VIP Support</li>
                        <li>All Future Updates</li>
                        <li>Priority Features</li>
                    </ul>
                </div>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button id="confirm-license" class="cyber-button" style="background: #0077cc; color: white; border: none; padding: 15px 40px;">
                    CONFIRM SELECTION
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(whiteThemeModal);
    
    // Open white theme when clicking the dropdown
    licenseType.addEventListener('click', (e) => {
        e.preventDefault();
        openWhiteThemeDropdown();
    });
    
    // Also open when focusing on the dropdown
    licenseType.addEventListener('focus', () => {
        openWhiteThemeDropdown();
    });
    
    function openWhiteThemeDropdown() {
        // Set white theme
        body.setAttribute('data-theme', 'white');
        whiteThemeModal.classList.add('active');
        dropdownOverlay.classList.add('active');
        
        // Disable body scroll
        document.body.style.overflow = 'hidden';
    }
    
    function closeWhiteThemeDropdown() {
        whiteThemeModal.classList.remove('active');
        dropdownOverlay.classList.remove('active');
        
        // Delay theme change for smooth transition
        setTimeout(() => {
            body.setAttribute('data-theme', 'dark');
        }, 300);
        
        // Re-enable body scroll
        document.body.style.overflow = '';
    }
    
    // Close button event
    whiteThemeModal.querySelector('.close-btn').addEventListener('click', closeWhiteThemeDropdown);
    
    // License option selection
    whiteThemeModal.querySelectorAll('.license-option').forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options
            whiteThemeModal.querySelectorAll('.license-option').forEach(opt => {
                opt.classList.remove('active');
            });
            
            // Add active class to selected option
            option.classList.add('active');
            
            // Update the original dropdown value
            const value = option.getAttribute('data-value');
            licenseType.value = value;
            
            // Trigger change event on original dropdown
            licenseType.dispatchEvent(new Event('change'));
            
            // Update confirmation button
            const confirmBtn = whiteThemeModal.querySelector('#confirm-license');
            confirmBtn.textContent = `SELECT ${option.querySelector('h4').textContent}`;
        });
    });
    
    // Confirm button event
    whiteThemeModal.querySelector('#confirm-license').addEventListener('click', () => {
        if (licenseType.value) {
            closeWhiteThemeDropdown();
            
            // Show notification for selected license
            const selectedOption = whiteThemeModal.querySelector(`.license-option[data-value="${licenseType.value}"]`);
            const licenseName = selectedOption.querySelector('h4').textContent;
            
            showNotification('success', 'License Selected', `${licenseName} has been selected. Please enter your license key.`);
        } else {
            showNotification('warning', 'No Selection', 'Please select a license type first.');
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && whiteThemeModal.classList.contains('active')) {
            closeWhiteThemeDropdown();
        }
    });
    
    // Close when clicking outside the license list
    whiteThemeModal.addEventListener('click', (e) => {
        if (e.target === whiteThemeModal) {
            closeWhiteThemeDropdown();
        }
    });
    
    // Show notification function
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
});