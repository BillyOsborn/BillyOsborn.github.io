// ============================================
// BILLY OSBORN ATETWE — PERSONAL WEBSITE
// script.js — Interactivity & Behaviour
// ============================================


// --- WAIT FOR PAGE TO FULLY LOAD ---
document.addEventListener('DOMContentLoaded', () => {


    // --- HAMBURGER MENU (Mobile) ---
    const hamburger = document.getElementById('hamburger');
    const navLinks   = document.getElementById('nav-links');

    // Toggle menu open/closed when hamburger is clicked
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    // Close menu when ANY link inside the nav is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });

    // Close menu if user clicks anywhere OUTSIDE the navbar
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            hamburger.classList.remove('open');
            navLinks.classList.remove('open');
        }
    });


    // --- NAVBAR SCROLL EFFECT ---
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    // --- ACTIVE LINK HIGHLIGHT ---
    // Highlights the nav link that matches the section you're viewing
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });


    // --- EXPERIENCE: EXPAND / COLLAPSE ACHIEVEMENTS ---
    document.querySelectorAll('.expand-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const card      = btn.closest('.entry-card');
            const panel     = card.querySelector('.entry-achievements');
            const isOpen    = btn.classList.contains('open');

            if (isOpen) {
                // Close it
                panel.style.display = 'none';
                btn.classList.remove('open');
                btn.querySelector('.expand-text').textContent = 'View Achievements';
            } else {
                // Open it
                panel.style.display = 'block';
                btn.classList.add('open');
                btn.querySelector('.expand-text').textContent = 'Hide Achievements';
            }
        });
    });


    // --- PROJECT FILTER TABS ---
    const filterBtns  = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category') || '';

                if (filter === 'all' || categories.includes(filter)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // --- CONTACT FORM (Formspree) ---
    const contactForm  = document.getElementById('contact-form');
    const submitBtn    = document.getElementById('submit-btn');
    const submitText   = document.getElementById('submit-text');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Button loading state
            submitBtn.disabled = true;
            submitText.textContent = 'Sending...';

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // Success
                    formFeedback.className = 'form-feedback success';
                    formFeedback.textContent =
                        '✅ Message sent! I will be in touch within 24 hours.';
                    contactForm.reset();
                } else {
                    throw new Error('Server error');
                }
            } catch (err) {
                // Error
                formFeedback.className = 'form-feedback error';
                formFeedback.textContent =
                    '❌ Something went wrong. Please email me directly at billyosborn139@gmail.com';
            } finally {
                submitBtn.disabled = false;
                submitText.textContent = 'Send Message';
            }
        });
    }


    // --- BOOKING OPTION TABS ---
    const bookingOptions = document.querySelectorAll('.booking-option-card');

    bookingOptions.forEach(option => {
        option.addEventListener('click', () => {
            bookingOptions.forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            // In a future enhancement, this can swap the Calendly URL
            // for different session types
        });
    });


    // --- INVOICE GENERATOR ---
    const generateBtn = document.getElementById('generate-invoice-btn');

    // Set today's date as default in the invoice date field
    const invDateField = document.getElementById('inv-date');
    if (invDateField) {
        invDateField.valueAsDate = new Date();
    }

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {

            // Get values
            const client  = document.getElementById('inv-client').value.trim();
            const email   = document.getElementById('inv-email').value.trim();
            const service = document.getElementById('inv-service').value.trim();
            const amount  = document.getElementById('inv-amount').value.trim();
            const date    = document.getElementById('inv-date').value;
            const notes   = document.getElementById('inv-notes').value.trim();

            // Basic validation
            if (!client || !email || !service || !amount) {
                alert('Please fill in all required fields (Client, Email, Service, Amount).');
                return;
            }

            // Format amount with commas
            const currency = document.getElementById('inv-currency').value;

            const localeMap = {
                'USD': 'en-US',
                'KES': 'en-KE',
                'EUR': 'de-DE',
                'GBP': 'en-GB'
            };

            const formattedAmount = parseFloat(amount).toLocaleString(
                localeMap[currency] || 'en-US',
                { minimumFractionDigits: 2, maximumFractionDigits: 2 }
            );

            // Generate invoice number: INV-YYYYMMDD-XXXX
            const now        = new Date();
            const dateStr    = now.toISOString().slice(0, 10).replace(/-/g, '');
            const randomCode = Math.floor(1000 + Math.random() * 9000);
            const invoiceNo  = `INV-${dateStr}-${randomCode}`;

            // Format display date
            const displayDate = date
                ? new Date(date).toLocaleDateString('en-GB', {
                    day: '2-digit', month: 'long', year: 'numeric'
                  })
                : now.toLocaleDateString('en-GB', {
                    day: '2-digit', month: 'long', year: 'numeric'
                  });

            // Build printable invoice HTML
            const invoiceHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${invoiceNo}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            color: #1A1A2E;
            background: #fff;
            padding: 48px;
            max-width: 800px;
            margin: 0 auto;
        }
        .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 48px;
            padding-bottom: 32px;
            border-bottom: 3px solid #0D1B2A;
        }
        .invoice-brand .name {
            font-size: 2rem;
            font-weight: 700;
            color: #0D1B2A;
            letter-spacing: -0.5px;
        }
        .invoice-brand .name span { color: #D4A843; }
        .invoice-brand p {
            font-size: 0.82rem;
            color: #6B7280;
            margin-top: 4px;
            line-height: 1.6;
        }
        .invoice-title-block { text-align: right; }
        .invoice-title-block h1 {
            font-size: 2.5rem;
            font-weight: 700;
            color: #0D1B2A;
            opacity: 0.08;
            letter-spacing: 2px;
            line-height: 1;
        }
        .invoice-title-block .inv-no {
            font-size: 0.9rem;
            color: #D4A843;
            font-weight: 700;
            letter-spacing: 1px;
            margin-top: 4px;
        }
        .invoice-title-block .inv-date {
            font-size: 0.82rem;
            color: #6B7280;
            margin-top: 4px;
        }
        .bill-to {
            margin-bottom: 40px;
        }
        .bill-to .label {
            font-size: 0.65rem;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #D4A843;
            margin-bottom: 8px;
        }
        .bill-to .client-name {
            font-size: 1.2rem;
            font-weight: 700;
            color: #0D1B2A;
        }
        .bill-to .client-email {
            font-size: 0.875rem;
            color: #6B7280;
            margin-top: 3px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 32px;
        }
        thead tr {
            background: #0D1B2A;
        }
        thead th {
            padding: 12px 16px;
            text-align: left;
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: rgba(255,255,255,0.7);
        }
        thead th:last-child { text-align: right; }
        tbody tr {
            border-bottom: 1px solid #f0f0f0;
        }
        tbody td {
            padding: 16px;
            font-size: 0.9rem;
            color: #1A1A2E;
            vertical-align: top;
        }
        tbody td:last-child { text-align: right; font-weight: 600; }
        .totals-block {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 40px;
        }
        .totals-table {
            width: 280px;
        }
        .totals-table tr td {
            padding: 8px 0;
            font-size: 0.875rem;
            border: none;
        }
        .totals-table tr td:last-child {
            text-align: right;
            font-weight: 600;
        }
        .totals-table .total-row td {
            font-size: 1.1rem;
            font-weight: 700;
            color: #0D1B2A;
            padding-top: 12px;
            border-top: 2px solid #0D1B2A;
        }
        .notes-block {
            background: #F5F7FA;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 40px;
        }
        .notes-block .label {
            font-size: 0.65rem;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #D4A843;
            margin-bottom: 8px;
        }
        .notes-block p {
            font-size: 0.875rem;
            color: #6B7280;
            line-height: 1.65;
        }
        .invoice-footer {
            text-align: center;
            padding-top: 24px;
            border-top: 1px solid #f0f0f0;
        }
        .invoice-footer p {
            font-size: 0.78rem;
            color: #aab0bb;
            line-height: 1.6;
        }
        .accent { color: #D4A843; }
        @media print {
            body { padding: 24px; }
        }
    </style>
</head>
<body>

    <div class="invoice-header">
        <div class="invoice-brand">
            <div class="name">Billy <span>Osborn</span></div>
            <p>
                Innovation & AI Leadership Consultant<br>
                billyosborn139@gmail.com · +254 719 343 085<br>
                Nairobi, Kenya
            </p>
        </div>
        <div class="invoice-title-block">
            <h1>INVOICE</h1>
            <div class="inv-no">${invoiceNo}</div>
            <div class="inv-date">Date: ${displayDate}</div>
        </div>
    </div>

    <div class="bill-to">
        <div class="label">Bill To</div>
        <div class="client-name">${client}</div>
        <div class="client-email">${email}</div>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width:60%">Description</th>
                <th>Currency</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>${service}</td>
                <td>${currency}</td>
                <td>${currency} ${formattedAmount}</td>
            </tr>
        </tbody>
    </table>

    <div class="totals-block">
        <table class="totals-table">
            <tr>
                <td>Subtotal</td>
                <td>KES ${formattedAmount}</td>
            </tr>
            <tr>
                <td style="color:#6B7280; font-size:0.8rem;">Tax (if applicable)</td>
                <td style="color:#6B7280; font-size:0.8rem;">—</td>
            </tr>
            <tr class="total-row">
                <td>Total Due</td>
                <td class="accent">${currency} ${formattedAmount}</td>
            </tr>
        </table>
    </div>

    ${notes ? `
    <div class="notes-block">
        <div class="label">Notes</div>
        <p>${notes}</p>
    </div>
    ` : ''}

    <div class="invoice-footer">
        <p>
            Thank you for your partnership.<br>
            Payment accepted via M-Pesa, bank transfer, or card.<br>
            <strong>Please quote invoice number ${invoiceNo} with your payment.</strong>
        </p>
    </div>

</body>
</html>`;

            // Open in new window and trigger print
            const invoiceWindow = window.open('', '_blank');
            invoiceWindow.document.write(invoiceHTML);
            invoiceWindow.document.close();

            // Give it a moment to render then print
            setTimeout(() => {
                invoiceWindow.focus();
                invoiceWindow.print();
            }, 500);

        });
    }


    // --- FOOTER YEAR (auto-updates every year) ---
    const footerYear = document.getElementById('footer-year');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }
    
// --- TESTIMONIALS CAROUSEL ---
    // Touch/swipe support for mobile — pause on touch
    const track = document.getElementById('carousel-track');

    if (track) {
        // Pause on touch start (mobile)
        track.addEventListener('touchstart', () => {
            track.style.animationPlayState = 'paused';
        }, { passive: true });

        // Resume on touch end
        track.addEventListener('touchend', () => {
            setTimeout(() => {
                track.style.animationPlayState = 'running';
            }, 2000); // 2 second pause after lifting finger
        }, { passive: true });
    }

// --- BLOG FILTER TABS ---
    const blogFilterBtns = document.querySelectorAll('.blog-filter-btn');
    const blogCards      = document.querySelectorAll('.blog-card');

    blogFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            blogFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            blogCards.forEach(card => {
                const category = card.getAttribute('data-category') || '';
                if (filter === 'all' || category.includes(filter)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });


    // --- NEWSLETTER FORM — handled by Brevo embed (see index.html) ---
    // API key removed for security. Form submission handled server-side by Brevo.

// --- ORG NAME REVEAL ON HOVER ---
    document.querySelectorAll('.tcard-org').forEach(org => {
        const parent = org.closest('.tcard-author-info');
        if (!parent) return;

        parent.addEventListener('mouseenter', () => {
            org.classList.add('scrolling');
        });
        parent.addEventListener('mouseleave', () => {
            org.classList.remove('scrolling');
        });
    });


}); // End DOMContentLoaded

// ---- COPY M-PESA NUMBER TO CLIPBOARD ----
function copyMpesa() {
    var number  = document.getElementById('mpesa-number').textContent.trim();
    var copyBtn = document.getElementById('copy-mpesa');

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(number).then(function() {
            copyBtn.textContent = 'Copied!';
            copyBtn.classList.add('copied');
            setTimeout(function() {
                copyBtn.textContent = 'Copy';
                copyBtn.classList.remove('copied');
            }, 2500);
        });
    } else {
        // Fallback for non-HTTPS (local file preview)
        var tempInput = document.createElement('input');
        document.body.appendChild(tempInput);
        tempInput.value = number;
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('copied');
        setTimeout(function() {
            copyBtn.textContent = 'Copy';
            copyBtn.classList.remove('copied');
        }, 2500);
    }
}