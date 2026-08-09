document.addEventListener('DOMContentLoaded', function () {
    const sidebarLayout = document.querySelector('.sidebar-layout');
    const sidebar = document.querySelector('.sidebar');
    // robust toggle selector: target .sidebar-toggle or icon-btn variants
    const toggle = document.querySelector('.sidebar-toggle') || document.querySelector('.icon-btn.sidebar-toggle') || document.querySelector('.icon-btn');
    const sidebarBack = document.querySelector('.sidebar-back');
    const alertCloseButtons = document.querySelectorAll('.alert button[data-dismiss="alert"]');
    const navItems = document.querySelectorAll('.nav-item');
    const searchInput = document.querySelector('.search-pill input') || document.querySelector('.search-input input') || null;

    function isMobileView() {
        return window.innerWidth <= 992;
    }

    function setSidebarState(open) {
        if (!sidebar || !sidebarLayout || !toggle) return;

        // normalize to boolean
        open = !!open;

        if (isMobileView()) {
            sidebar.classList.toggle('open', open);
            toggle.classList.toggle('active', open);
            sidebar.setAttribute('aria-hidden', String(!open));
            toggle.setAttribute('aria-expanded', String(open));
            return;
        }

        // Desktop: when open === true -> remove collapsed class
        sidebarLayout.classList.toggle('sidebar-collapsed', !open);
        // Toggle active on the button to reflect open state
        toggle.classList.toggle('active', open);
        // Accessibility attributes
        sidebar.setAttribute('aria-hidden', String(!open));
        toggle.setAttribute('aria-expanded', String(open));
    }

    if (toggle && sidebar && sidebarLayout) {
        toggle.addEventListener('click', function () {
            if (isMobileView()) {
                const shouldOpen = !sidebar.classList.contains('open');
                setSidebarState(shouldOpen);
            } else {
                const isCollapsed = sidebarLayout.classList.contains('sidebar-collapsed');
                setSidebarState(isCollapsed);
            }
        });
    }

    if (sidebarBack) {
        sidebarBack.addEventListener('click', function () {
            const pathParts = window.location.pathname.split('/');
            if (pathParts[pathParts.length - 1] === '') {
                pathParts.pop();
            }
            if (pathParts.length > 1 && ['user', 'admin'].includes(pathParts[pathParts.length - 2])) {
                pathParts.splice(pathParts.length - 2, 2, 'welcome.html');
            } else {
                pathParts[pathParts.length - 1] = 'welcome.html';
            }
            const relativePath = pathParts.join('/');
            if (window.location.protocol === 'file:') {
                window.location.href = relativePath;
            } else if (window.location.origin && window.location.origin !== 'null') {
                window.location.href = window.location.origin + relativePath;
            } else {
                window.location.href = relativePath;
            }
        });
    }

    window.addEventListener('resize', function () {
        if (!isMobileView() && sidebar) {
            // ensure desktop starts with sidebar visible
            sidebar.classList.remove('open');
            sidebar.setAttribute('aria-hidden', 'false');
        }
        if (isMobileView() && sidebarLayout) {
            // on mobile, collapse the desktop-expanded layout
            sidebarLayout.classList.remove('sidebar-collapsed');
            toggle && toggle.classList.remove('active');
            toggle && toggle.setAttribute('aria-expanded', 'false');
            sidebar && sidebar.setAttribute('aria-hidden', 'true');
        }
        if (!isMobileView() && toggle) {
            // ensure aria reflects desktop visible default
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'true');
        }
    });

    alertCloseButtons.forEach((button) => {
        button.addEventListener('click', function () {
            const alert = button.closest('.alert');
            if (alert) {
                alert.classList.add('hidden');
            }
        });
    });

    navItems.forEach((item) => {
        // Mark active nav item on load for anchors and data-route entries
        if (item.tagName === 'A') {
            const href = item.getAttribute('href') || '';
            try {
                // Resolve the anchor's absolute URL to avoid ambiguous filename matches (e.g., both user/dashboard.html and admin/dashboard.html)
                const resolvedHref = new URL(href, window.location.href).href;
                if (window.location.href === resolvedHref || window.location.href.startsWith(resolvedHref) || window.location.href.indexOf(href) !== -1) {
                    item.classList.add('active');
                }
            } catch (err) {
                // Fallback to previous heuristic if URL resolution fails (e.g., non-standard environments)
                const norm = href.replace(/^\.\.?\//, '').replace(/^\//, '');
                const lastSegment = norm.split('/').pop();
                try {
                    if (lastSegment && (window.location.pathname.endsWith(lastSegment) || window.location.href.indexOf(norm) !== -1)) {
                        item.classList.add('active');
                    }
                } catch (err2) {
                    // ignore
                }
            }

            // let the browser handle navigation, but still update active class on click for UX
            item.addEventListener('click', function () {
                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
            return;
        }

        if (item.dataset.route && window.location.pathname.endsWith(item.dataset.route)) {
            item.classList.add('active');
        }

        // For non-anchor elements, support data-route navigation
        item.addEventListener('click', function (e) {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            if (item.dataset && item.dataset.route) {
                e.preventDefault();
                let route = item.dataset.route;
                try {
                    // normalize and strip leading slashes for file:// compatibility
                    if (route && route.startsWith('/')) route = route.slice(1);
                    if (window.location.pathname.indexOf('/user/') !== -1 && route.startsWith('user/')) route = route.replace(/^user\//, '');
                    if (window.location.pathname.indexOf('/admin/') !== -1 && route.startsWith('admin/')) route = route.replace(/^admin\//, '');
                    const resolved = new URL(route, window.location.href).href;
                    window.location.href = resolved;
                } catch (err) {
                    window.location.href = route;
                }
            }
        });
    });

    const languageSwitcher = document.querySelector('.language-switcher');
    const languageButton = document.querySelector('.language-button');
    const languageLabel = document.querySelector('.language-label');
    const languageOptions = document.querySelectorAll('.language-option');

    if (languageSwitcher && languageButton) {
        const applyLanguage = function (lang) {
            const selectedLang = lang === 'hi' ? 'hi' : 'en';
            languageOptions.forEach((option) => {
                const active = option.dataset.lang === selectedLang;
                option.classList.toggle('is-active', active);
            });
            if (languageLabel) {
                languageLabel.textContent = selectedLang === 'hi' ? 'हिंदी' : 'English';
            }
            languageButton.setAttribute('aria-expanded', 'false');
            languageSwitcher.classList.remove('open');
            localStorage.setItem('preferredLanguage', selectedLang);
            if (typeof translatePage === 'function') {
                translatePage(selectedLang);
            }
        };

        languageButton.addEventListener('click', function (event) {
            event.stopPropagation();
            const isOpen = languageSwitcher.classList.toggle('open');
            languageButton.setAttribute('aria-expanded', String(isOpen));
        });

        languageOptions.forEach((option) => {
            option.addEventListener('click', function (event) {
                event.stopPropagation();
                applyLanguage(option.dataset.lang || 'en');
            });
        });

        document.addEventListener('click', function (event) {
            if (!languageSwitcher.contains(event.target)) {
                languageSwitcher.classList.remove('open');
                languageButton.setAttribute('aria-expanded', 'false');
            }
        });

        const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
        applyLanguage(savedLanguage);
    }

    // Keyboard shortcut for search: Cmd/Ctrl+K focuses the search input
    if (searchInput) {
        document.addEventListener('keydown', function (e) {
            const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
            if ((isMac && e.metaKey && e.key.toLowerCase() === 'k') || (!isMac && e.ctrlKey && e.key.toLowerCase() === 'k')) {
                e.preventDefault();
                searchInput.focus();
                // place caret at end
                const val = searchInput.value; searchInput.value = ''; searchInput.value = val;
                // show search as focused UI
                const pill = searchInput.closest('.search-pill'); if (pill) pill.classList.add('focus');
            }
        });

        // remove focus style on blur
        searchInput.addEventListener('blur', function () {
            const pill = searchInput.closest('.search-pill'); if (pill) pill.classList.remove('focus');
        });
    }

    const translations = {
        hi: {
            'AI Grievance Portal': 'एआई शिकायत पोर्टल',
            'Welcome | AI Grievance Portal': 'स्वागत | एआई शिकायत पोर्टल',
            'Admin Dashboard – AI Grievance Portal': 'एडमिन डैशबोर्ड – एआई शिकायत पोर्टल',
            'Citizen Login – AI Grievance Portal': 'नागरिक लॉगिन – एआई शिकायत पोर्टल',
            'Register – AI Grievance Portal': 'रजिस्टर – एआई शिकायत पोर्टल',
            'Forgot Password – AI Grievance Portal': 'पासवर्ड भूल गए – एआई शिकायत पोर्टल',
            'Complaint History – AI Grievance Portal': 'शिकायत इतिहास – एआई शिकायत पोर्टल',
            'Lodge New Grievance – AI Grievance Portal': 'नई शिकायत दर्ज करें – एआई शिकायत पोर्टल',
            'User Dashboard – AI Grievance Portal': 'उपयोगकर्ता डैशबोर्ड – एआई शिकायत पोर्टल',
            'User Profile – AI Grievance Portal': 'उपयोगकर्ता प्रोफ़ाइल – एआई शिकायत पोर्टल',
            'Admin Panel': 'एडमिन पैनल',
            'Portal Menu': 'पोर्टल मेनू',
            'Citizen Portal': 'नागरिक पोर्टल',
            'Admin Portal': 'एडमिन पोर्टल',
            'Dashboard': 'डैशबोर्ड',
            'Lodge New Grievance': 'नई शिकायत दर्ज करें',
            'Complaint History': 'शिकायत इतिहास',
            'Track Complaint': 'शिकायत ट्रैक करें',
            'Profile': 'प्रोफ़ाइल',
            'Admin Dashboard': 'एडमिन डैशबोर्ड',
            'All Complaints': 'सभी शिकायतें',
            'Analytics': 'विश्लेषण',
            'Departments': 'विभाग',
            'Citizen Users': 'नागरिक उपयोगकर्ता',
            'Language': 'भाषा',
            'Admin': 'एडमिन',
            'Citizen': 'नागरिक',
            'Admin / Citizen': 'एडमिन / नागरिक',
            'Administrative control center': 'प्रशासनिक नियंत्रण केंद्र',
            'Close sidebar': 'साइडबार बंद करें',
            'Toggle sidebar': 'साइडबार टॉगल करें',
            'Select language': 'भाषा चुनें',
            'Sidebar navigation': 'साइडबार नेविगेशन',
            'Sign In': 'साइन इन',
            'Back to List': 'सूची पर वापस जाएँ',
            'Back to welcome page': 'वेलकम पेज पर वापस जाएँ',
            'Assigned to': 'सौंपा गया',
            'Search analytics': 'एनालिटिक्स खोजें',
            'Search departments': 'विभागों में खोजें',
            'Search users': 'उपयोगकर्ताओं में खोजें',
            'Search complaints': 'शिकायतों में खोजें',
            'My Profile': 'मेरी प्रोफ़ाइल',
            'Security': 'सुरक्षा',
            'Review details, update status, and reassign the department if needed.': 'विवरण की समीक्षा करें, स्थिति अपडेट करें, और आवश्यक होने पर विभाग को पुनः सौंपें।',
            'Review incoming grievances, track critical alerts, and monitor resolution performance.': 'आगामी शिकायतों की समीक्षा करें, महत्वपूर्ण अलर्ट ट्रैक करें, और समाधान प्रदर्शन की निगरानी करें।',
            'Smart complaint routing': 'स्मार्ट शिकायत मार्गदर्शन',
            'Track your grievances, review status updates, and lodge new issues without delay.': 'अपनी शिकायतों को ट्रैक करें, स्थिति अपडेट देखें, और बिना देरी के नए मुद्दे दर्ज करें।',
            'Your grievance has been submitted successfully.': 'आपकी शिकायत सफलतापूर्वक सबमिट हो गई है।',
            'AI identifies the right department instantly so citizens don\'t waste time finding the correct channel.': 'एआई तुरंत सही विभाग की पहचान करता है ताकि नागरिकों को सही चैनल खोजने में समय बर्बाद न होना पड़े।',
            'AI is helping to assign the right department automatically.': 'एआई सही विभाग को स्वचालित रूप से असाइन करने में मदद कर रहा है।',
            'AI routing reduced reassignment delays in July.': 'एआई मार्गदर्शन ने जुलाई में पुनः असाइनमेंट देरी को कम किया।',
            'Field team has been notified and will inspect the site today.': 'फील्ड टीम को सूचित किया गया है और वह आज साइट का निरीक्षण करेगी।',
            'Two-factor authentication': 'दो-तरीका प्रमाणीकरण',
            'File On': 'दर्ज किया गया',
            'Welcome, Municipal Admin': 'स्वागत है, नगर प्रशासन',
            'Welcome back, Priya': 'फिर से स्वागत है, प्रिया',
            'Citizen-friendly grievance lodging': 'नागरिक-अनुकूल शिकायत पंजीकरण',
            'Contact our helpdesk if you need assistance with filing your grievance.': 'अपनी शिकायत दर्ज करने में सहायता चाहिए तो हमारी हेल्पडेस्क से संपर्क करें।',
            'Assigned Department': 'निर्दिष्ट विभाग',
            'Priority': 'प्राथमिकता',
            'Completed': 'पूरा किया गया',
            'Pending': 'लंबित',
            'Filed On': 'दर्ज किया गया',
            'AI': 'एआई',
            'Address': 'पता',
            'Department': 'विभाग',
            'Citizen user management': 'नागरिक उपयोगकर्ता प्रबंधन',
            'Complaint overview': 'शिकायत अवलोकन',
            'Department operations and workload': 'विभागीय संचालन और कार्यभार',
            'Departmental workload': 'विभागीय कार्यभार',
            'Designed for inclusive urban grievance management.': 'समावेशी शहरी शिकायत प्रबंधन के लिए डिज़ाइन किया गया।',
            'Dismiss alert': 'अलर्ट बंद करें',
            'Don\'t have an account?': 'क्या आपका खाता नहीं है?',
            'Don�t have an account?': 'क्या आपका खाता नहीं है?',
            'General Services': 'सामान्य सेवाएं',
            'Latest updates with status and department assignment.': 'स्थिति और विभाग असाइनमेंट के साथ नवीनतम अपडेट।',
            'Municipal Admin': 'नगर प्रशासन',
            'Officer note': 'अधिकारी नोट',
            'Post comments': 'टिप्पणियाँ पोस्ट करें',
            'This month': 'इस महीने',
            'Total Complaints': 'कुल शिकायतें',
            'Under investigation': 'जांच के तहत',
            'Search by complaint ID, title or department...': 'शिकायत आईडी, शीर्षक या विभाग द्वारा खोजें...',
            'Search history by title or ID...': 'शीर्षक या आईडी द्वारा इतिहास खोजें...',
            'Register now': 'अब रजिस्टर करें',
            'Remembered your password?': 'क्या आपने अपना पासवर्ड याद कर लिया है?',
            'Save Updates': 'अपडेट सहेजें',
            'Review details, update status, and reassign the department if needed.': 'विवरण की समीक्षा करें, स्थिति अपडेट करें, और आवश्यक होने पर विभाग को पुनः सौंपें।',
            'Search by complaint title or ID...': 'शिकायत शीर्षक या आईडी द्वारा खोजें...',
            'Select language': 'भाषा चुनें',
            'My Account': 'मेरा खाता',
            'Search grievances, departments, status...': 'शिकायतें, विभाग, स्थिति खोजें...',
            'Search grievances, users, departments...': 'शिकायतें, उपयोगकर्ता, विभाग खोजें...',
            'Search complaints...': 'शिकायतों में खोजें...',
            'Search complaints': 'शिकायत खोजें',
            'Search analytics reports...': 'एनालिटिक्स रिपोर्ट्स में खोजें...',
            'Search departments...': 'विभागों में खोजें...',
            'Search registered citizens...': 'पंजीकृत नागरिकों में खोजें...',
            'Search by complaint ID, title or resident...': 'शिकायत आईडी, शीर्षक या निवासी द्वारा खोजें...',
            'Quick action search': 'त्वरित खोज',
            'Accessibility support available for all citizens.': 'सभी नागरिकों के लिए पहुंच समर्थन उपलब्ध।',
            'Helpline: 1800-123-4567 | Email: support@aigrievance.gov.in': 'हेल्पलाइन: 1800-123-4567 | ईमेल: support@aigrievance.gov.in',
            'Citizen-friendly grievance lodging': 'नागरिक-अनुकूल शिकायत पंजीकरण',
            'Hackathon 2026 Project': 'हैकाथॉन 2026 परियोजना',
            'AI Grievance Portal for Citizens': 'नागरिकों के लिए एआई शिकायत पोर्टल',
            'Master complaint register': 'मास्टर शिकायत रेज़िस्टर',
            'Filter, review, and assign grievances across all city departments.': 'सभी शहर विभागों में शिकायतों को फ़िल्टर, समीक्षा और असाइन करें।',
            'Filters': 'फ़िल्टर',
            'Filter by priority': 'प्राथमिकता के अनुसार फ़िल्टर करें',
            'All Priorities': 'सभी प्राथमिकताएँ',
            'Low': 'कम',
            'Medium': 'मध्यम',
            'High': 'उच्च',
            'Critical': 'गंभीर',
            'Filter by department': 'विभाग द्वारा फ़िल्टर करें',
            'All Departments': 'सभी विभाग',
            'Roads': 'सड़कों',
            'Water Supply': 'जल आपूर्ति',
            'Power Grid': 'पावर ग्रिड',
            'Active assignments': 'सक्रिय असाइनमेंट',
            'Keep track of department workload and complaint statuses.': 'विभागीय कार्यभार और शिकायत की स्थिति पर नज़र रखें।',
            'Action': 'कार्रवाई',
            'View': 'देखें',
            'Administrative complaint management': 'प्रशासनिक शिकायत प्रबंधन',
            'Master complaint register': 'मास्टर शिकायत रेज़िस्टर',
            'Search by complaint ID, title or resident...': 'शिकायत आईडी, शीर्षक या निवासी द्वारा खोजें...',
            'Analytics dashboard': 'एनालिटिक्स डैशबोर्ड',
            'Explore department performance, grievance categories, and monthly trends.': 'विभाग के प्रदर्शन, शिकायत श्रेणियों और मासिक रुझानों का अन्वेषण करें।',
            'Key insights': 'मुख्य अंतर्दृष्टियाँ',
            'Sanitation team resolved 28% more cases this month': 'स्वच्छता टीम ने इस महीने 28% अधिक मामले हल किए',
            'Focus on rapid response helped clear backlog faster.': 'त्वरित प्रतिक्रिया पर ध्यान देने से बकाया काम तेजी से साफ़ हुआ।',
            'Water supply complaints account for 24% of total volume': 'जल आपूर्ति शिकायतें कुल मात्रा का 24% बनाती हैं',
            'Works department is prioritizing leak detection and repair.': 'कार्य विभाग रिसाव का पता लगाने और मरम्मत को प्राथमिकता दे रहा है।',
            'Average resolution stable at 3.8 days': 'औसत समाधान 3.8 दिनों पर स्थिर है',
            'Grievance analytics and performance reporting': 'शिकायत विश्लेषण और प्रदर्शन रिपोर्टिंग',
            'Departments directory': 'विभाग निर्देशिका',
            'View department leads, active workloads, and pending complaint counts.': 'विभाग प्रमुखों, सक्रिय कार्यभार, और लंबित शिकायत गणना देखें।',
            'Current focus area:': 'वर्तमान फोकस क्षेत्र:',
            'Head Officer:': 'मुख्य अधिकारी:',
            'Pending cases:': 'लंबित मामले:',
            'Registered citizens': 'पंजीकृत नागरिक',
            'Manage user accounts and check complaint activity across the portal.': 'उपयोगकर्ता खातों का प्रबंधन करें और पोर्टल में शिकायत गतिविधि जांचें।',
            'Citizen directory': 'नागरिक निर्देशिका',
            'Active users with complaint summaries and account status.': 'शिकायत सारांश और खाता स्थिति के साथ सक्रिय उपयोगकर्ता।',
            'Name': 'नाम',
            'Email': 'ईमेल',
            'Phone': 'फ़ोन',
            'Location': 'स्थान',
            'Complaints': 'शिकायतें',
            'Active': 'सक्रिय',
            'Pending Verification': 'पुष्टिकरण लंबित',
            'Suspended': 'निलंबित',
            'Submit complaints in your local language, get automated department routing, and track every grievance with live status updates.': 'अपनी स्थानीय भाषा में शिकायत दर्ज करें, स्वचालित विभाग मार्गदर्शन पाएं, और प्रत्येक शिकायत को लाइव स्टेटस अपडेट के साथ ट्रैक करें।',
            'What makes this portal special?': 'यह पोर्टल क्या खास बनाता है?',
            'Multi-language support': 'बहु-भाषा समर्थन',
            'Speak in your own language and our chatbot will understand and register your grievance accurately.': 'अपनी भाषा में बोलें और हमारा चैटबॉट आपकी शिकायत को सही ढंग से समझकर दर्ज करेगा।',
            'Real-time tracking': 'रीयल-टाइम ट्रैकिंग',
            'Receive live updates and unique complaint numbers for every request you submit.': 'सबमिट की गई प्रत्येक अनुरोध के लिए लाइव अपडेट और एक अद्वितीय शिकायत संख्या प्राप्त करें।',
            'One dashboard for all': 'सभी के लिए एक डैशबोर्ड',
            'Citizens and admins can access a clean interface for grievance management and progress monitoring.': 'नागरिक और एडमिन दोनों शिकायत प्रबंधन और प्रगति निगरानी के लिए साफ़ इंटरफ़ेस तक पहुँच सकते हैं।',
            'How it works': 'यह कैसे काम करता है',
            '1. Describe your issue': '1. अपनी समस्या बताएं',
            '2. AI assigns department': '2. एआई विभाग निर्दिष्ट करता है',
            '3. Track progress': '3. प्रगति ट्रैक करें',
            'Describe your issue': 'अपनी समस्या बताएं',
            'Use voice or text in your local language to tell the portal what problem you are facing.': 'अपनी स्थानीय भाषा में वॉयस या टेक्स्ट का उपयोग करके पोर्टल को बताएं कि आप किस समस्या का सामना कर रहे हैं।',
            'The portal automatically matches the complaint to the right municipal department.': 'पोर्टल स्वचालित रूप से शिकायत को सही नगरपालिका विभाग से जोड़ता है।',
            'Get updates and chat with support until your grievance is resolved.': 'अपनी शिकायत के निपटारे तक अपडेट प्राप्त करें और सपोर्ट से चैट करें।',
            'Ready to improve citizen service delivery?': 'नागरिक सेवा वितरण बेहतर करने के लिए तैयार?',
            'Build trust, reduce confusion, and speed up grievance resolution with a user-friendly AI-assisted grievance portal.': 'एक उपयोगकर्ता-अनुकूल एआई-सहायता प्राप्त शिकायत पोर्टल के साथ विश्वास बनाएं, भ्रम कम करें, और शिकायत समाधान को तेज़ करें।',
            'Get Started': 'शुरू करें',
            'Welcome back': 'फिर से स्वागत है',
            'Sign in to lodge or track your grievance with ease.': 'आसान तरीके से अपनी शिकायत दर्ज करने या ट्रैक करने के लिए साइन इन करें।',
            'Email Address': 'ईमेल पता',
            'Password': 'पासवर्ड',
            'Remember Me': 'मुझे याद रखें',
            'Forgot Password?': 'पासवर्ड भूल गए?',
            'Create your account': 'अपना खाता बनाएं',
            'Register as a citizen to lodge grievances and track updates easily.': 'शिकायत दर्ज करने और अपडेट आसानी से ट्रैक करने के लिए नागरिक के रूप में पंजीकरण करें।',
            'Full Name': 'पूरा नाम',
            'Phone Number': 'फ़ोन नंबर',
            'Residential Address': 'निवासी पता',
            'Confirm Password': 'पासवर्ड की पुष्टि करें',
            'Create Account': 'खाता बनाएं',
            'Already registered?': 'पहले से पंजीकृत हैं?',
            'Sign in here': 'यहाँ साइन इन करें',
            'Forgot your password?': 'क्या आपने अपना पासवर्ड भूल गए?',
            'Enter your email address to receive a password reset link.': 'पासवर्ड रीसेट लिंक प्राप्त करने के लिए अपना ईमेल पता दर्ज करें।',
            'Send Reset Link': 'रीसेट लिंक भेजें',
            'Back to Login': 'लॉगिन पर वापस जाएँ',
            'Lodge a new grievance': 'नई शिकायत दर्ज करें',
            'English': 'अंग्रेज़ी',
            'Hindi': 'हिंदी',
            'Regional': 'क्षेत्रीय',
            'Use the AI-assisted form to provide issue details and upload supporting media.': 'समस्या विवरण प्रदान करने और सहायक मीडिया अपलोड करने के लिए एआई-सहायता प्राप्त फ़ॉर्म का उपयोग करें।',
            'Start voice dictation': 'वॉयस डिक्टेशन शुरू करें',
            'Complaint details': 'शिकायत विवरण',
            'Complaint Title': 'शिकायत शीर्षक',
            'Enter a short complaint title': 'एक संक्षिप्त शिकायत शीर्षक दर्ज करें',
            'Category': 'श्रेणी',
            'Road': 'सड़क',
            'Water': 'पानी',
            'Electricity': 'बिजली',
            'Sanitation': 'स्वच्छता',
            'Other': 'अन्य',
            'Detailed description': 'विस्तृत विवरण',
            'Explain the issue in your own words': 'अपनी बात अपने शब्दों में समझाएँ',
            'Drag and drop an image here': 'एक छवि यहाँ ड्रैग और ड्रॉप करें',
            'or click to browse files (max 5MB).': 'या फ़ाइल देखने के लिए क्लिक करें (अधिकतम 5MB)।',
            'Upload photo': 'फ़ोटो अपलोड करें',
            'Submit Complaint': 'शिकायत सबमिट करें',
            'Track your complaint': 'अपनी शिकायत ट्रैक करें',
            'Follow the live progress of your grievance from lodging to resolution.': 'अपनी शिकायत की लाइव प्रगति को दर्ज करने से समाधान तक ट्रैक करें।',
            '1. Complaint Lodged': '1. शिकायत दर्ज की गई',
            '2. AI Analyzed': '2. एआई ने विश्लेषण किया',
            '3. Department Assigned': '3. विभाग निर्दिष्ट किया गया',
            '4. In Progress': '4. प्रगति में',
            '5. Resolved': '5. सुलझा हुआ',
            'Your grievance has been successfully submitted and assigned an ID.': 'आपकी शिकायत सफलतापूर्वक सबमिट की गई है और एक आईडी असाइन की गई है।',
            'The complaint content was analyzed and categorized for the correct department.': 'शिकायत की सामग्री का विश्लेषण किया गया और सही विभाग के लिए वर्गीकृत किया गया।',
            'The complaint has been forwarded to the Water Supply department team.': 'शिकायत को वॉटर सप्लाई विभाग टीम को अग्रेषित किया गया है।',
            'Field officers are currently reviewing the issue and scheduling resolution.': 'फ़ील्ड अधिकारी वर्तमान में समस्या की समीक्षा कर रहे हैं और समाधान निर्धारित कर रहे हैं।',
            'The complaint will move to resolved once the field work is complete and verified.': 'फ़ील्ड कार्य पूरा होने और सत्यापित होने पर शिकायत सुलझे हुए में चली जाएगी।',
            'Completed': 'पूरा किया गया',
            'Ongoing': 'चल रहा है',
            'Track Live Progress': 'लाइव प्रगति ट्रैक करें',
            'Complaint Details': 'शिकायत विवरण',
            'Review your grievance summary, AI assessment, and officer responses.': 'अपनी शिकायत का सारांश, एआई आकलन, और अधिकारी की प्रतिक्रियाओं की समीक्षा करें।',
            'Current Status': 'वर्तमान स्थिति',
            'AI Assessment Summary': 'एआई आकलन सारांश',
            'Official Comments': 'आधिकारिक टिप्पणियाँ',
            'Officer notes': 'अधिकारी नोट्स',
            'Sanitation Supervisor': 'स्वच्छता पर्यवेक्षक',
            'Assigned officer': 'नियुक्त अधिकारी',
            'Inspection completed. Cleaning crew will clear the drain on the next working day.': 'निरीक्षण पूरा हुआ। सफाई दल अगले कार्य दिवस पर नाली साफ़ करेगा।',
            'Concern escalated to the sanitation task force. Expected resolution by 2026-08-10.': 'चिंता को स्वच्छता टास्क फोर्स को बढ़ाया गया। समाधान अपेक्षित 2026-08-10 तक।',
            'High': 'उच्च',
            'AI Preview': 'एआई पूर्वावलोकन',
            'Priority': 'प्राथमिकता',
            'Assigned Department': 'निर्दिष्ट विभाग',
            'AI assessment': 'एआई आकलन',
            'AI preview will update when you describe the issue in the box above.': 'जब आप ऊपर बॉक्स में समस्या का वर्णन करेंगे तो एआई पूर्वावलोकन अपडेट हो जाएगा।',
            'Complaint history': 'शिकायत इतिहास',
            'Review all grievances you have lodged and check their current status.': 'उन सभी शिकायतों की समीक्षा करें जो आपने दर्ज की हैं और उनकी वर्तमान स्थिति जांचें।',
            'Search by complaint title or ID...': 'शिकायत शीर्षक या आईडी द्वारा खोजें...',
            'Filter by category': 'श्रेणी द्वारा फ़िल्टर करें',
            'All categories': 'सभी श्रेणियाँ',
            'Complaint ID': 'शिकायत आईडी',
            'Title': 'शीर्षक',
            'Category': 'श्रेणी',
            'Status': 'स्थिति',
            'Submitted': 'सबमिट किया गया',
            'In Progress': 'प्रगति में',
            'Pending': 'लंबित',
            'Resolved': 'सुलझा हुआ',
            'High Priority': 'उच्च प्राथमिकता',
            'Critical Priority Alerts': 'क्रिटिकल प्राथमिकता अलर्ट',
            'Total Active Cases': 'कुल सक्रिय मामले',
            'Resolved Cases': 'सुलझाए गए मामले',
            'Average Resolution Time': 'औसत समाधान समय',
            'Issues requiring immediate attention.': 'तत्काल ध्यान की आवश्यकता वाले मुद्दे।',
            'Currently being handled across departments.': 'वर्तमान में विभागों में संभाले जा रहे हैं।',
            'Successfully closed this month.': 'इस महीने सफलतापूर्वक बंद किए गए।',
            'Across all departments.': 'सभी विभागों में।',
            'Incoming grievance feed': 'आगामी शिकायत फ़ीड',
            'Assigned to': 'सौंपा गया',
            'High Priority': 'उच्च प्राथमिकता',
            'Medium Priority': 'मध्यम प्राथमिकता',
            'Critical Priority': 'गंभीर प्राथमिकता',
            'Grievance categories': 'शिकायत श्रेणियाँ',
            'Monthly resolution rate': 'मासिक समाधान दर',
            'My Profile': 'मेरा प्रोफ़ाइल',
            'Update your account details, notification settings, and security preferences.': 'अपने खाते का विवरण, अधिसूचना सेटिंग्स और सुरक्षा प्राथमिकताएं अपडेट करें।',
            'Registered Since': 'पंजीकरण की तारीख',
            'Open Complaints': 'खुली शिकायतें',
            'Resolved Requests': 'सुलझाई गई अनुरोध',
            'Preferred Language': 'पसंदीदा भाषा',
            'Account information': 'खाता जानकारी',
            'Notification preferences': 'अधिसूचना प्राथमिकताएं',
            'Security': 'सुरक्षा',
            'Manage account': 'खाता प्रबंधित करें',
            'Download data': 'डेटा डाउनलोड करें',
            'Deactivate account': 'खाता निष्क्रिय करें',
            'Last changed 45 days ago': '45 दिन पहले बदला गया',
            'Not enabled': 'सक्रिय नहीं',
            'Request your grievance history export.': 'अपनी शिकायत इतिहास निर्यात का अनुरोध करें।',
            'Temporarily suspend your profile.': 'अस्थायी रूप से अपनी प्रोफ़ाइल निलंबित करें।',
            'Email Alerts': 'ईमेल अलर्ट',
            'SMS Updates': 'एसएमएस अपडेट',
            'WhatsApp Alerts': 'व्हाट्सएप अलर्ट',
            'Enabled': 'सक्रिय',
            'Disabled': 'अक्षम',
            'Submit Complaint': 'शिकायत सबमिट करें',
            'Track Complaint': 'शिकायत ट्रैक करें',
            'View All': 'सभी देखें',
            'Sorry, the page you are looking for cannot be found. Please check the URL or return to the home page.': 'क्षमा करें, जिस पेज को आप ढूंढ रहे हैं वह नहीं मिला। कृपया URL जांचें या होम पेज पर वापस जाएँ।',
            'Return to Home': 'होम पर वापस जाएँ',
            'Oops! Something went wrong on our end. Please try again or return to the home page.': 'उफ़! हमारी ओर से कुछ गलत हो गया। कृपया फिर से प्रयास करें या होम पेज पर वापस जाएँ।',
            'Retry Home': 'होम फिर से प्रयास करें',
            'Uploaded evidence for complaint': 'शिकायत के लिए अपलोड की गई साक्ष्य',
            'English': 'अंग्रेज़ी',
            'Hindi': 'हिंदी',
            'Regional': 'क्षेत्रीय'
        }
    };

    const partialTranslations = [
        { prefix: 'Welcome back, ', hi: 'वापसी पर स्वागत है, ' },
        { prefix: 'Assigned to ', hi: 'सौंपा गया ' },
        { prefix: 'View department leads, active workloads, and pending complaint counts.', hi: 'विभाग प्रमुखों, सक्रिय कार्यभार, और लंबित शिकायत गणना देखें।' },
        { prefix: 'Assigned to ', hi: 'सौंपा गया ' },
        { prefix: ' · High Priority', hi: ' · उच्च प्राथमिकता' },
        { prefix: ' · Medium Priority', hi: ' · मध्यम प्राथमिकता' },
        { prefix: ' · Critical Priority', hi: ' · गंभीर प्राथमिकता' }
    ];

    const wordTranslations = {
        ai: 'एआई',
        grievance: 'शिकायत',
        grievances: 'शिकायतें',
        portal: 'पोर्टल',
        dashboard: 'डैशबोर्ड',
        admin: 'एडमिन',
        citizen: 'नागरिक',
        citizens: 'नागरिकों',
        department: 'विभाग',
        departments: 'विभाग',
        search: 'खोजें',
        sign: 'साइन',
        'sign-in': 'साइन-इन',
        in: 'इन',
        profile: 'प्रोफ़ाइल',
        language: 'भाषा',
        track: 'ट्रैक',
        complaint: 'शिकायत',
        complaints: 'शिकायतें',
        history: 'इतिहास',
        priority: 'प्राथमिकता',
        status: 'स्थिति',
        open: 'खुला',
        resolved: 'सुलझा',
        total: 'कुल',
        by: 'द्वारा',
        to: 'को',
        and: 'और',
        with: 'के साथ',
        from: 'से',
        update: 'अपडेट',
        updates: 'अपडेट',
        today: 'आज',
        your: 'आपकी',
        welcome: 'स्वागत',
        back: 'वापसी',
        information: 'जानकारी',
        create: 'बनाएँ',
        account: 'खाता',
        forgot: 'भूल गए',
        password: 'पासवर्ड',
        register: 'रजिस्टर',
        login: 'लॉगिन',
        home: 'होम',
        helpdesk: 'हेल्पडेस्क',
        assistance: 'सहायता',
        upload: 'अपलोड',
        comments: 'टिप्पणियाँ',
        review: 'समीक्षा',
        day: 'दिन',
        month: 'महीना',
        case: 'मामला',
        cases: 'मामले',
        assigned: 'सौंपा गया',
        inspection: 'निरीक्षण',
        field: 'फ़ील्ड',
        team: 'टीम',
        report: 'रिपोर्ट',
        active: 'सक्रिय',
        pending: 'लंबित',
        closed: 'बंद',
        alert: 'अलर्ट',
        monitoring: 'निगरानी',
        performance: 'प्रदर्शन',
        work: 'काम',
        issue: 'मुद्दा',
        issues: 'मुद्दे',
        choose: 'चुनें',
        role: 'भूमिका',
        remembered: 'याद किया',
        remember: 'याद',
        now: 'अब',
        service: 'सेवा',
        delivery: 'वितरण',
        local: 'स्थानीय',
        support: 'सहायता',
        submit: 'सबमिट',
        lodged: 'दर्ज',
        title: 'शीर्षक',
        or: 'या',
        estimated: 'अनुमानित',
        today: 'आज',
        current: 'वर्तमान',
        help: 'सहायता',
        department: 'विभाग',
        departments: 'विभाग',
        content: 'सामग्री',
        review: 'समीक्षा',
        updated: 'अपडेट',
        comment: 'टिप्पणी',
        comments: 'टिप्पणियाँ',
        detail: 'विवरण',
        details: 'विवरण',
        response: 'प्रतिक्रिया',
        case: 'मामला',
        cases: 'मामले',
        status: 'स्थिति',
        inspection: 'निरीक्षण',
        assigned: 'सौंपा गया',
        assigned: 'सौंपा गया'
    };

    function translateByWords(text, lang) {
        if (lang !== 'hi') {
            return text;
        }

        return text.replace(/\b[\w'-]+\b/g, (word) => {
            const lowerWord = word.toLowerCase();
            return wordTranslations[lowerWord] || word;
        });
    }

    const pageTitleTranslations = {
        hi: {
            'AI Grievance Portal': 'एआई शिकायत पोर्टल',
            'Welcome | AI Grievance Portal': 'स्वागत | एआई शिकायत पोर्टल',
            'Admin Dashboard – AI Grievance Portal': 'एडमिन डैशबोर्ड – एआई शिकायत पोर्टल',
            'Citizen Login – AI Grievance Portal': 'नागरिक लॉगिन – एआई शिकायत पोर्टल',
            'Register – AI Grievance Portal': 'रजिस्टर – एआई शिकायत पोर्टल',
            'Forgot Password – AI Grievance Portal': 'पासवर्ड भूल गए – एआई शिकायत पोर्टल',
            'Complaint History – AI Grievance Portal': 'शिकायत इतिहास – एआई शिकायत पोर्टल',
            'Lodge New Grievance – AI Grievance Portal': 'नई शिकायत दर्ज करें – एआई शिकायत पोर्टल',
            'User Dashboard – AI Grievance Portal': 'उपयोगकर्ता डैशबोर्ड – एआई शिकायत पोर्टल',
            'User Profile – AI Grievance Portal': 'उपयोगकर्ता प्रोफ़ाइल – एआई शिकायत पोर्टल',
            'Analytics – AI Grievance Portal': 'एनालिटिक्स – एआई शिकायत पोर्टल',
            'Departments – AI Grievance Portal': 'विभाग – एआई शिकायत पोर्टल',
            'Citizen Users – AI Grievance Portal': 'नागरिक उपयोगकर्ता – एआई शिकायत पोर्टल',
            'Complaint Details – AI Grievance Portal': 'शिकायत विवरण – एआई शिकायत पोर्टल',
            'Track Complaint – AI Grievance Portal': 'शिकायत ट्रैक करें – एआई शिकायत पोर्टल',
            'Complaint View – AI Grievance Portal': 'शिकायत दृश्य – एआई शिकायत पोर्टल',
            'Analytics – AI Grievance Portal': 'एनालिटिक्स – एआई शिकायत पोर्टल',
            'Admin Dashboard – AI Grievance Portal': 'एडमिन डैशबोर्ड – एआई शिकायत पोर्टल',
            'All Complaints — AI Grievance Portal': 'सभी शिकायतें — एआई शिकायत पोर्टल',
            'All Complaints – AI Grievance Portal': 'सभी शिकायतें – एआई शिकायत पोर्टल'
        }
    };

    function getPageTranslation(text, lang) {
        if (lang === 'regional') {
            lang = 'hi';
        }
        return (pageTitleTranslations[lang] && pageTitleTranslations[lang][text]) || text;
    }

    const originalTextNodes = new WeakMap();

    function getTranslation(text, lang) {
        if (lang === 'regional') {
            lang = 'hi';
        }
        if (lang === 'en' || !translations[lang]) {
            return text;
        }

        const dictionary = translations[lang];
        if (dictionary[text]) {
            return dictionary[text];
        }

        // Case-insensitive fallback: many templates use uppercase or different casing (e.g., "CITIZEN PORTAL").
        const lower = text.toLowerCase();
        for (const k of Object.keys(dictionary)) {
            if (k.toLowerCase() === lower) {
                return dictionary[k];
            }
        }

        for (const item of partialTranslations) {
            if (lang === 'hi' && text.startsWith(item.prefix)) {
                return item.hi + text.slice(item.prefix.length);
            }
        }

        return translateByWords(text, lang);
    }

    function translateTextNode(textNode, lang) {
        const originalText = originalTextNodes.get(textNode) || textNode.textContent;
        if (!originalText || !originalText.trim()) {
            return;
        }
        if (!originalTextNodes.has(textNode)) {
            originalTextNodes.set(textNode, originalText);
        }

        const textToTranslate = originalText.trim();
        const translated = getTranslation(textToTranslate, lang);
        if (translated !== textToTranslate) {
            textNode.textContent = originalText.replace(textToTranslate, translated);
        } else if (lang === 'en') {
            textNode.textContent = originalText;
        }
    }

    function translateTextNodes(element, lang) {
        element.childNodes.forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE) {
                translateTextNode(child, lang);
            } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
                translateTextNodes(child, lang);
            }
        });
    }

    function translateElementAttributes(element, lang) {
        if (element.placeholder) {
            const originalPlaceholder = element.dataset.originalPlaceholder || element.placeholder;
            if (!element.dataset.originalPlaceholder) {
                element.dataset.originalPlaceholder = originalPlaceholder;
            }
            const translatedPlaceholder = getTranslation(originalPlaceholder, lang);
            element.placeholder = translatedPlaceholder;
        }

        if (element.title) {
            const originalTitle = element.dataset.originalTitle || element.title;
            if (!element.dataset.originalTitle) {
                element.dataset.originalTitle = originalTitle;
            }
            const translatedTitle = getTranslation(originalTitle, lang);
            element.title = translatedTitle;
        }

        if (element.alt) {
            const originalAlt = element.dataset.originalAlt || element.alt;
            if (!element.dataset.originalAlt) {
                element.dataset.originalAlt = originalAlt;
            }
            const translatedAlt = getTranslation(originalAlt, lang);
            element.alt = translatedAlt;
        }

        if (element.getAttribute('aria-label')) {
            const originalAria = element.dataset.originalAria || element.getAttribute('aria-label');
            if (!element.dataset.originalAria) {
                element.dataset.originalAria = originalAria;
            }
            const translatedAria = getTranslation(originalAria, lang);
            element.setAttribute('aria-label', translatedAria);
        }
    }

    function translatePage(lang) {
        const pageTitle = document.title;
        document.title = getPageTranslation(pageTitle, lang);
        document.documentElement.lang = lang === 'hi' || lang === 'regional' ? 'hi' : 'en';

        const elements = Array.from(document.body.querySelectorAll('*'));
        elements.forEach((element) => {
            if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') {
                return;
            }
            translateElementAttributes(element, lang);
        });

        translateTextNodes(document.body, lang);
    }

    function initializeLanguageSwitcher() {
        const languageSelect = document.getElementById('language-select');
        const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
        if (languageSelect) {
            languageSelect.value = savedLanguage;
            languageSelect.addEventListener('change', function () {
                const selectedLanguage = languageSelect.value;
                localStorage.setItem('preferredLanguage', selectedLanguage);
                translatePage(selectedLanguage);
            });
        }
        translatePage(savedLanguage);
    }

    // Robust fallback: ensure .language-option buttons always trigger translation even if menu handlers fail
    (function attachLanguageOptionFallback() {
        const languageOptionsFallback = document.querySelectorAll('.language-option');
        const languageLabelEl = document.querySelector('.language-label');
        languageOptionsFallback.forEach((btn) => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const lang = btn.dataset.lang || 'en';
                try {
                    localStorage.setItem('preferredLanguage', lang);
                } catch (err) {
                    // ignore storage errors
                }
                if (languageLabelEl) languageLabelEl.textContent = lang === 'hi' ? 'हिंदी' : 'English';
                if (typeof translatePage === 'function') translatePage(lang);
                // close menu UI if present
                const languageSwitcherEl = document.querySelector('.language-switcher');
                if (languageSwitcherEl) languageSwitcherEl.classList.remove('open');
            });
        });
    })();

    initializeLanguageSwitcher();
});
