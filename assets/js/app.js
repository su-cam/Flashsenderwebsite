document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const sendBtn = document.getElementById('send-btn');
    const cryptoAddressInput = document.getElementById('crypto-address');
    const cryptoAmountInput = document.getElementById('crypto-amount');
    const pasteBtn = document.getElementById('paste-btn');
    const cryptoOptions = document.getElementsByName('crypto');
    const transactionAnimation = document.getElementById('transaction-animation');
    const networkSelection = document.getElementById('network-selection');
    const networkSelect = document.getElementById('network');
    const notificationContainer = document.getElementById('notification-container');

    // Show notification function
    function showNotification(type, title, message) {
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

    // Validate number input
    function validateNumberInput(input) {
        const cursorPos = input.selectionStart;
        input.value = input.value.replace(/[^0-9.]/g, '');
        
        // Handle cases where decimal is at start
        if (input.value.startsWith('.')) {
            input.value = '0' + input.value;
        }
        
        // Handle multiple decimals
        const decimalCount = input.value.split('.').length - 1;
        if (decimalCount > 1) {
            input.value = input.value.substring(0, input.value.lastIndexOf('.'));
        }
        
        // Restore cursor position
        input.setSelectionRange(cursorPos, cursorPos);
    }

    // Validate crypto address
    function validateCryptoAddress(address, type, network) {
        const trc20Regex = /^T[A-Za-z1-9]{33}$/;
        const btcRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
        const ethRegex = /^0x[a-fA-F0-9]{40}$/;

        if (type === 'USDT') {
            if (network === 'TRC-20') {
                return trc20Regex.test(address);
            } else if (network === 'ERC-20' || network === 'BEP-20') {
                return ethRegex.test(address);
            }
        } else if (type === 'BTC') {
            return btcRegex.test(address);
        }
        return false;
    }

    // Initialize with welcome notification
    setTimeout(() => {
        showNotification('success', 'System Ready', 'Flash Sender activated successfully');
    }, 1000);

    // Event Listeners
    cryptoAmountInput.addEventListener('input', () => {
        validateNumberInput(cryptoAmountInput);
    });

    pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            cryptoAddressInput.value = text;
            cryptoAddressInput.dispatchEvent(new Event('input'));
        } catch (err) {
            showNotification('error', 'Clipboard Error', 'Failed to read clipboard contents. Please paste manually.');
        }
    });

    cryptoOptions.forEach(option => {
        option.addEventListener('change', () => {
            networkSelection.style.display = 'block';
            networkSelect.disabled = false;

            if (option.value === 'USDT') {
                networkSelect.innerHTML = `
                    <option value="">-- CHOOSE NETWORK --</option>
                    <option value="TRC-20">TRC-20</option>
                    <option value="BEP-20">BEP-20</option>
                    <option value="ERC-20">ERC-20</option>
                `;
            } else if (option.value === 'BTC') {
                networkSelect.innerHTML = `
                    <option value="">-- CHOOSE NETWORK --</option>
                    <option value="BTC">BTC Network</option>
                `;
            }

            cryptoAddressInput.disabled = true;
            cryptoAmountInput.disabled = true;
            sendBtn.disabled = true;
            cryptoAddressInput.value = '';
            cryptoAmountInput.value = '';
        });
    });

    networkSelect.addEventListener('change', () => {
        if (networkSelect.value) {
            cryptoAddressInput.disabled = false;
            pasteBtn.disabled = false;
            cryptoAddressInput.placeholder = `Enter ${networkSelect.value} Address`;
        } else {
            cryptoAddressInput.disabled = true;
            pasteBtn.disabled = true;
            cryptoAmountInput.disabled = true;
            sendBtn.disabled = true;
        }
    });

    cryptoAddressInput.addEventListener('input', () => {
        const selectedCrypto = document.querySelector('input[name="crypto"]:checked');
        if (!selectedCrypto || !networkSelect.value) return;

        const isValid = validateCryptoAddress(
            cryptoAddressInput.value, 
            selectedCrypto.value, 
            networkSelect.value
        );

        if (cryptoAddressInput.value.trim() !== "" && isValid) {
            cryptoAmountInput.disabled = false;
            cryptoAddressInput.classList.remove('error');
            showNotification('success', 'Valid Address', 'Address format is correct');
        } else if (cryptoAddressInput.value.trim() !== "") {
            cryptoAmountInput.disabled = true;
            sendBtn.disabled = true;
            cryptoAddressInput.classList.add('error');
            showNotification('error', 'Invalid Address', `Please enter a valid ${networkSelect.value} address`);
        } else {
            cryptoAddressInput.classList.remove('error');
        }
    });

    cryptoAmountInput.addEventListener('input', () => {
        if (cryptoAmountInput.value.trim() !== "" && cryptoAmountInput.value !== "0") {
            sendBtn.disabled = false;
        } else {
            sendBtn.disabled = true;
        }
    });

    sendBtn.addEventListener('click', () => {
        const selectedCrypto = document.querySelector('input[name="crypto"]:checked');
        if (!cryptoAddressInput.value || !cryptoAmountInput.value || !selectedCrypto) return;

        sendBtn.disabled = true;
        transactionAnimation.classList.remove('hidden');
        
        let percentage = 0;
        const duration = 5000; // 5 seconds
        const progressElement = document.getElementById('loader-progress');
        
        const interval = setInterval(() => {
            if (percentage <= 100) {
                percentage++;
                document.getElementById('percentage').innerText = `${percentage}%`;
                if (progressElement) {
                    progressElement.style.background = `conic-gradient(var(--primary) ${percentage}%, transparent ${percentage}%)`;
                }
            } else {
                clearInterval(interval);
                transactionAnimation.classList.add('hidden');
                
                showNotification(
                    'success', 
                    'Transaction Complete', 
                    `Successfully sent ${cryptoAmountInput.value} ${selectedCrypto.value}`
                );
                
                // Reset form
                setTimeout(() => {
                    cryptoAddressInput.value = '';
                    cryptoAmountInput.value = '';
                    cryptoAddressInput.disabled = true;
                    cryptoAmountInput.disabled = true;
                    sendBtn.disabled = true;
                    networkSelect.value = '';
                    networkSelect.disabled = true;
                    networkSelection.style.display = 'none';
                    cryptoOptions.forEach(opt => opt.checked = false);
                }, 1000);
            }
        }, duration / 100);
    });
});