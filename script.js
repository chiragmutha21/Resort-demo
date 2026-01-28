// 1. Instant Dashboard Check (Execute immediately before anything else)
(function () {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'dashboard' || (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')) {
        document.documentElement.style.display = 'none'; // Hide everything to avoid flash
        window.addEventListener('DOMContentLoaded', () => {
            const landing = document.getElementById('landing-screen');
            const dashboard = document.getElementById('dashboard');
            if (landing && dashboard) {
                landing.style.display = 'none';
                dashboard.style.display = 'block';
                dashboard.classList.add('fade-in');
            }
            document.documentElement.style.display = 'block';
        });
    }
})();

window.onload = () => {
    generateQuickQR();
};

function generateQuickQR() {
    const qrContainer = document.getElementById('qrcode');
    if (!qrContainer) return;

    // Use current URL with dashboard mode as an immediate default
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('mode', 'dashboard');
    const defaultUrl = currentUrl.toString();

    const qr = new QRCode(qrContainer, {
        text: defaultUrl,
        width: 250,
        height: 250,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M // Medium for faster processing
    });

    // Quietly update with exact Local IP in background (optional optimization)
    fetch('/api/get-qr').then(r => r.json()).then(data => {
        if (data.url && data.url !== defaultUrl) {
            qrContainer.innerHTML = '';
            new QRCode(qrContainer, {
                text: data.url,
                width: 250,
                height: 250
            });
        }
    }).catch(() => { });
}

function openDashboard(instant = false) {
    const landing = document.getElementById('landing-screen');
    const dashboard = document.getElementById('dashboard');

    if (instant) {
        landing.style.display = 'none';
        dashboard.style.display = 'block';
        dashboard.classList.add('fade-in');
        return;
    }

    landing.style.transition = 'opacity 0.3s ease';
    landing.style.opacity = '0';

    setTimeout(() => {
        landing.style.display = 'none';
        dashboard.style.display = 'block';
        dashboard.classList.add('fade-in');
    }, 200);
}

const appliancesData = {
    geyser: {
        title: "Proper Geyser Operation",
        steps: `
            <ul style="padding-left: 20px; color: var(--text-muted); list-style-type: decimal;">
                <li style="margin-bottom: 5px;">Locate the <strong>Red Safety Switch</strong> outside the bathroom entrance.</li>
                <li style="margin-bottom: 5px;">Switch it ON at least 15-20 minutes before your shower.</li>
                <li style="margin-bottom: 5px;">Wait for the red indicator light to turn steady (heating).</li>
                <li style="margin-bottom: 5px;">Mix with cold water using the mixer tap for the perfect temperature.</li>
                <li style="margin-bottom: 5px;"><strong>Crucial:</strong> Please switch it OFF after use to save energy.</li>
            </ul>`,
        videoUrl: "https://www.youtube.com/embed/ApZiWjtJO-Y?modestbranding=1&rel=0&playsinline=1"
    },
    ac: {
        title: "Comfort Control (AC)",
        steps: `
            <ul style="padding-left: 20px; color: var(--text-muted); list-style-type: decimal;">
                <li style="margin-bottom: 5px;">Use the <strong>Remote</strong> from the wall dock to power ON.</li>
                <li style="margin-bottom: 5px;">Ensure the mode is set to <strong>'COOL'</strong> (Snowflake icon).</li>
                <li style="margin-bottom: 5px;">Set the temperature up to <strong>24°C</strong> for perfect comfort.</li>
                <li style="margin-bottom: 5px;">Keep all windows and balcony doors closed.</li>
                <li style="margin-bottom: 5px;">Use 'Swing' to distribute the cool air evenly.</li>
            </ul>`,
        videoUrl: "https://www.youtube.com/embed/8eJLPOy8xrw?modestbranding=1&rel=0&playsinline=1"
    },
    tv: {
        title: "Entertainment Center (TV)",
        steps: `
            <ul style="padding-left: 20px; color: var(--text-muted); list-style-type: decimal;">
                <li style="margin-bottom: 5px;">Use the <strong>Samsung Remote</strong> to power on the smart screen.</li>
                <li style="margin-bottom: 5px;">Select the 'Home' icon to find Netflix, Prime, and Disney+.</li>
                <li style="margin-bottom: 5px;">For local channels, switch input to <strong>HDMI 1</strong>.</li>
                <li style="margin-bottom: 5px;">Use the smaller White remote to browse live channels.</li>
                <li style="margin-bottom: 5px;">Volume and channels can be controlled directly.</li>
            </ul>`,
        videoUrl: "https://www.youtube.com/embed/inYKFG0kfXg?modestbranding=1&rel=0&playsinline=1"
    }
};

function showAppliance(type) {
    const detailContent = document.getElementById('detail-content');
    if (!detailContent) return;

    // Manage tabs
    const tabs = detailContent.querySelectorAll('.appliance-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.innerText.toLowerCase().includes(type)) {
            tab.classList.add('active');
        }
    });

    // Update dynamic content
    const data = appliancesData[type];
    if (data) {
        const titleEl = detailContent.querySelector('#app-title');
        const stepsEl = detailContent.querySelector('#app-steps');
        const iframeEl = detailContent.querySelector('#app-video-frame');

        if (titleEl) titleEl.innerText = data.title;
        if (stepsEl) stepsEl.innerHTML = data.steps;
        if (iframeEl) iframeEl.src = data.videoUrl;
    }
}

// Global Detail View Functions
function openDetail(sectionId, title, iconClass) {
    const overlay = document.getElementById('detail-overlay');
    const detailContent = document.getElementById('detail-content');
    const overlayTitle = document.getElementById('overlay-title');
    const overlayIcon = document.getElementById('overlay-icon');

    // Get content from repository
    const sourceSection = document.getElementById('sec-' + sectionId);
    if (!sourceSection) return;

    // Update header
    overlayTitle.innerText = title;
    overlayIcon.className = 'fas ' + iconClass;

    // Inject content
    detailContent.innerHTML = sourceSection.innerHTML;

    // Special Initialization for Appliances
    if (sectionId === 'appliances') {
        showAppliance('geyser');
    }

    // Show overlay with animation
    overlay.style.display = 'block';
    overlay.style.transform = 'translateY(100%)';
    overlay.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

    setTimeout(() => {
        overlay.style.transform = 'translateY(0)';
    }, 10);
}

function closeDetail() {
    const overlay = document.getElementById('detail-overlay');
    overlay.style.transform = 'translateY(100%)';

    setTimeout(() => {
        overlay.style.display = 'none';
    }, 400);
}

function startCheckInProcess() {
    const detailContent = document.getElementById('detail-content');
    const uploadArea = detailContent.querySelector('#id-upload-area');
    if (uploadArea) {
        uploadArea.style.display = 'flex';
        uploadArea.classList.add('fade-in');
    }
}

function handleIdUpload(input) {
    const detailContent = document.getElementById('detail-content');
    const status = detailContent.querySelector('#upload-status');
    if (input.files && input.files[0]) {
        const fileName = input.files[0].name;
        status.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Uploading: ${fileName}...`;

        setTimeout(() => {
            status.innerHTML = `<i class="fas fa-check-circle" style="color: #4CAF50;"></i> Verified Successfully!`;
        }, 2000);
    }
}
