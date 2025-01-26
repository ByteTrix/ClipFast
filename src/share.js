document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToShare = urlParams.get('url');
    const encodedUrl = encodeURIComponent(urlToShare);

    // Validate URL
    if (!urlToShare) {
        alert('No URL provided!');
        window.close();
        return;
    }

    // Initialize URL input
    document.getElementById('url-input').value = urlToShare;

    // Social service links
    const services = {
        whatsapp: `https://api.whatsapp.com/send?text=${encodedUrl}`,
        telegram: `https://t.me/share/url?url=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}`,
        reddit: `https://reddit.com/submit?url=${encodedUrl}`,
        pinterest: `https://pinterest.com/pin/create/link/?url=${encodedUrl}`,
        email: `mailto:?subject=Shared%20Link&body=${encodedUrl}`
    };

    Object.keys(services).forEach(service => {
        const btn = document.getElementById(service);
        if (btn) {
            btn.href = services[service];
            btn.target = '_blank';
            btn.rel = 'noopener noreferrer';

            btn.addEventListener('click', () => {
                setTimeout(() => {
                    if (window.opener && window.opener !== window) {
                        window.close();
                    }
                }, 1000);
            });
        }
    });

    // Copy URL functionality
    document.getElementById('copy-url').addEventListener('click', () => {
        navigator.clipboard.writeText(urlToShare)
            .then(() => alert('URL copied to clipboard!'))
            .catch(() => alert('Failed to copy URL!'));
    });

    // QR Code functionality
    let qrCodeInstance = null;
    document.getElementById('qrcode-trigger').addEventListener('click', () => {
        const modal = document.getElementById('qrcode-modal');
        modal.style.display = 'flex';

        if (!qrCodeInstance) {
            qrCodeInstance = new QRCode(document.getElementById('qrcode'), {
                text: urlToShare,
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        }
    });

    // Close modal
    document.getElementById('close-modal').addEventListener('click', () => {
        document.getElementById('qrcode-modal').style.display = 'none';
    });

    document.getElementById('qrcode-modal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('qrcode-modal')) {
            document.getElementById('qrcode-modal').style.display = 'none';
        }
    });

    // Open popup programmatically
    let popupWindow;
    document.getElementById('open-popup').addEventListener('click', () => {
        popupWindow = window.open(
            `share.html?url=${encodedUrl}`,
            '_blank',
            'width=600,height=400'
        );
    });

    // Close popup programmatically
    document.getElementById('close-popup').addEventListener('click', () => {
        if (popupWindow) {
            popupWindow.close();
        } else {
            alert('No popup window to close!');
        }
    });

    // Auto-close window if idle
    if (window.opener && window.opener !== window) {
        const autoCloseTimer = setTimeout(() => {
            window.close();
        }, 30000); // 30 seconds

        document.addEventListener('mousemove', () => {
            clearTimeout(autoCloseTimer);
            setTimeout(() => window.close(), 30000);
        });
    }
});
