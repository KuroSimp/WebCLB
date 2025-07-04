(() => {
    'use strict';

    const API_BASE = 'https://backendwebclb.onrender.com'; // Đổi thành http://localhost:3000 khi chạy local nếu cần

    // Function to set up mobile menu interactions
    const setupMobileMenu = () => {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuContent = document.querySelector('.mobile-menu-content');
        const closeMenuButton = document.getElementById('close-menu');
        const mobileMenuLinks = document.querySelectorAll('#mobile-menu .nav-link, #mobile-menu .event-trigger');

        if (mobileMenuButton && mobileMenu && closeMenuButton && mobileMenuContent) {
            const openMenu = () => {
                mobileMenu.classList.remove('hidden');
                setTimeout(() => {
                    mobileMenuContent.classList.remove('-translate-x-full');
                }, 10);
            };

            const closeMenu = () => {
                mobileMenuContent.classList.add('-translate-x-full');
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 300);
            };
            
            mobileMenuButton.addEventListener('click', openMenu);
            closeMenuButton.addEventListener('click', closeMenu);

            mobileMenu.addEventListener('click', (e) => {
                if (e.target === mobileMenu) {
                    closeMenu();
                }
            });

            mobileMenuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    // We need a small delay to allow the other scripts to process the click (like page switching)
                    setTimeout(closeMenu, 150);
                });
            });
        }
    };

    // Function to set up smooth scrolling for navigation links
    const setupSmoothScroll = () => {
        document.querySelectorAll('a.nav-link[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    // --- Hero Section Slider ---
    const setupHeroSlider = () => {
        const slides = document.querySelectorAll('.slide');
        if (slides.length === 0) return;

        let currentSlide = 0;
        
        // Make the first slide active initially
        slides[currentSlide].classList.add('active');

        const nextSlide = () => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }

        setInterval(nextSlide, 5000);
    };
    
    // Function to set up member card interactions
    const setupMemberCardInteraction = () => {
        const roleItems = document.querySelectorAll('.member-role-item');
        if (roleItems.length === 0) return;
        
        const contentItems = document.querySelectorAll('.member-info-content');
        const imageItems = document.querySelectorAll('.member-v2-image');

        roleItems.forEach(roleItem => {
            roleItem.addEventListener('click', (e) => {
                // Check if the click is from the auto-cycler or a real user
                // Real user clicks are "trusted"
                if (e.isTrusted) {
                    stopMemberCycling();
                }
                
                if (roleItem.classList.contains('active')) return;

                const memberKey = roleItem.dataset.member;

                roleItems.forEach(item => item.classList.remove('active'));
                roleItem.classList.add('active');

                contentItems.forEach(content => content.classList.toggle('active', content.dataset.content === memberKey));
                imageItems.forEach(image => image.classList.toggle('active', image.dataset.content === memberKey));
            });
        });
    };

    // --- Member Card Auto-Cycling ---
    let memberInterval; // Keep it in the outer scope
    const startMemberCycling = () => {
        stopMemberCycling(); // Ensure no multiple intervals are running
        memberInterval = setInterval(() => {
            const currentActive = document.querySelector('.member-role-item.active');
            if (!currentActive) return;
            let nextItem = currentActive.nextElementSibling;
            if (!nextItem || !nextItem.classList.contains('member-role-item')) {
                nextItem = document.querySelector('.member-role-item:first-child');
            }
            if(nextItem) {
                // Dispatch a non-trusted event to avoid stopping the cycle
                const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
                nextItem.dispatchEvent(clickEvent);
            }
        }, 5000);
    };

    const stopMemberCycling = () => {
        clearInterval(memberInterval);
    };

    const setupMemberCyclingInteraction = () => {
        const memberCard = document.querySelector('.member-card-v2');
        if (memberCard) {
            startMemberCycling();
            memberCard.addEventListener('mouseenter', stopMemberCycling);
            memberCard.addEventListener('mouseleave', startMemberCycling);
        }
    };

    // --- Animate Stats Numbers on Scroll ---
    const animateStats = () => {
        const statElements = document.querySelectorAll('.stats-grid');
        if (statElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    statNumbers.forEach(el => {
                        const targetText = el.textContent;
                        const targetNum = parseInt(targetText.replace('+', ''), 10);
                        
                        if (!el.dataset.animated && !isNaN(targetNum)) {
                            el.dataset.animated = 'true';
                            let currentNum = 0;
                            const increment = Math.ceil(targetNum / 100) || 1;

                            const counter = setInterval(() => {
                                currentNum += increment;
                                if (currentNum >= targetNum) {
                                    el.textContent = `${targetNum}+`;
                                    clearInterval(counter);
                } else {
                                    el.textContent = `${currentNum}+`;
                                }
                            }, 20);
                        }
                    });
                     // Unobserve after animating to prevent re-triggering
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statElements.forEach(stat => {
            observer.observe(stat);
        });
    };

    // --- Join Form Animation on Scroll ---
    const setupJoinFormAnimation = () => {
        const stickyContainer = document.getElementById('join-sticky-container');
        const collage = document.getElementById('collage-wrapper');
        const form = document.getElementById('join-form-wrapper');

        if (!stickyContainer || !collage || !form) return;

        window.addEventListener('scroll', () => {
            const rect = stickyContainer.getBoundingClientRect();
            const scrollInside = -rect.top;
            const scrollableDistance = stickyContainer.offsetHeight - window.innerHeight;

            if (scrollInside > 0 && scrollInside < scrollableDistance) {
                const progress = Math.min(1, scrollInside / (scrollableDistance * 0.7));
                collage.style.opacity = 1 - progress;
                collage.style.transform = `scale(${1 - progress * 0.1})`;
                form.style.opacity = progress;
                if (progress > 0.5) {
                    collage.style.display = 'none';
                    form.classList.remove('pointer-events-none');
                    form.style.zIndex = 20;
                } else {
                    collage.style.display = 'flex';
                    form.classList.add('pointer-events-none');
                    form.style.zIndex = 1;
                }
            } else if (scrollInside <= 0) {
                collage.style.opacity = 1;
                collage.style.transform = 'scale(1)';
                collage.style.display = 'flex';
                form.style.opacity = 0;
                form.classList.add('pointer-events-none');
                form.style.zIndex = 1;
            } else {
                collage.style.opacity = 0;
                collage.style.display = 'none';
                form.style.opacity = 1;
                form.classList.remove('pointer-events-none');
                form.style.zIndex = 20;
            }
        });
    };

    // --- Page-level Navigation (Show/Hide All Events page) ---
    const setupEventPageToggle = () => {
        const mainContent = document.querySelector('.main-content-wrapper');
        const eventsPage = document.getElementById('all-events-page');
        const eventTriggers = document.querySelectorAll('.event-trigger');
        const mainNavLinks = document.querySelectorAll('.header-menu-link, .nav-link-home, .nav-link');

        if (!mainContent || !eventsPage || eventTriggers.length === 0) return;

        const showMainContent = () => {
            mainContent.classList.remove('hidden');
            eventsPage.classList.add('hidden');
        };

        const showEventsPage = () => {
            mainContent.classList.add('hidden');
            eventsPage.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        eventTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                showEventsPage();
            });
        });

        mainNavLinks.forEach(link => {
            // Chỉ add listener cho các link về section trên main page
            if (link.getAttribute('href')?.startsWith('#')) {
                link.addEventListener('click', (e) => {
                    if (!eventsPage.classList.contains('hidden')) {
                        // Nếu đang ở trang sự kiện, chuyển về main page và cuộn đến section
                        e.preventDefault();
                        showMainContent();
                        const targetId = link.getAttribute('href');
                        setTimeout(() => {
                            const targetElement = document.querySelector(targetId);
                            if (targetElement) {
                                targetElement.scrollIntoView({ behavior: 'smooth' });
                            }
                        }, 100);
                    }
                });
            }
        });
    };

    // --- Event Filtering ---
    document.addEventListener('DOMContentLoaded', function () {
        const filterButtons = document.querySelectorAll('.filter-button');
        const eventCards = document.querySelectorAll('.event-card');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                // Xác định loại filter
                let type = 'all';
                if (btn.textContent.includes('Sắp diễn ra')) type = 'upcoming';
                else if (btn.textContent.includes('Đang diễn ra')) type = 'ongoing';
                else if (btn.textContent.includes('Đã diễn ra')) type = 'past';
                // Đổi active
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                // Lọc sự kiện
                eventCards.forEach(card => {
                    if (type === 'all' || card.getAttribute('data-event-type') === type) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    });

    // Hiệu ứng fade-in khi cuộn (luôn kiểm tra các phần tử chưa visible)
    function handleFadeInOnScroll() {
        const fadeEls = document.querySelectorAll('.fade-in:not(.visible)');
        const windowHeight = window.innerHeight;
        fadeEls.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < windowHeight - 60) {
                el.classList.add('visible');
            }
        });
    }
    window.addEventListener('scroll', handleFadeInOnScroll);
    window.addEventListener('DOMContentLoaded', handleFadeInOnScroll);
    window.addEventListener('resize', handleFadeInOnScroll);

    // Khi chuyển trang sự kiện (all-events-page), cũng gọi lại hiệu ứng fade-in
    const eventTriggers = document.querySelectorAll('.event-trigger');
    eventTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(handleFadeInOnScroll, 100); // Đợi DOM cập nhật
        });
    });

    // Counter động cho số liệu
    let counterAnimated = false;
    function animateCounters() {
        if (counterAnimated) return;
        const statsGrid = document.querySelector('.stats-grid.fade-in, .stats-grid');
        if (!statsGrid || !statsGrid.classList.contains('visible')) return;
        const counters = statsGrid.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            if (isNaN(target)) return;
            let start = 0;
            const plus = counter.textContent.includes('+');
            const duration = 1200;
            const startTime = performance.now();
            function update(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const value = Math.floor(progress * target);
                counter.textContent = value + (plus ? '+' : '');
                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target + (plus ? '+' : '');
                }
            }
            requestAnimationFrame(update);
        });
        counterAnimated = true;
    }
    window.addEventListener('scroll', animateCounters);
    window.addEventListener('DOMContentLoaded', animateCounters);

    // --- Handle Member Registration Form Submission ---
    const setupRegisterForm = () => {
        const form = document.getElementById('contactForm');
        if (!form) return;
        // Tạo vùng hiển thị thông báo nếu chưa có
        let msgBox = form.querySelector('.form-message-box');
        if (!msgBox) {
            msgBox = document.createElement('div');
            msgBox.className = 'form-message-box text-center my-2';
            form.insertBefore(msgBox, form.firstChild);
        }
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            msgBox.textContent = '';
            msgBox.classList.remove('text-green-600', 'text-red-600');
            const name = form.name.value.trim();
            const email = form.email.value.trim();
            const phone = form.phone.value.trim();
            const reason = form.reason.value.trim();
            if (!name || !email || !phone || !reason) {
                msgBox.textContent = 'Vui lòng nhập đầy đủ thông tin.';
                msgBox.classList.add('text-red-600');
                return;
            }
            try {
                const res = await fetch(`${API_BASE}/api/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, phone, reason })
                });
                const data = await res.json();
                if (res.ok) {
                    msgBox.textContent = 'Đăng ký thành công! Cảm ơn bạn đã tham gia BIT.';
                    msgBox.classList.add('text-green-600');
                    form.reset();
                } else {
                    msgBox.textContent = data.error || 'Đăng ký thất bại. Vui lòng thử lại.';
                    msgBox.classList.add('text-red-600');
                }
            } catch (err) {
                msgBox.textContent = 'Lỗi kết nối máy chủ. Vui lòng thử lại sau.';
                msgBox.classList.add('text-red-600');
            }
        });
    };

    // Initialize all scripts
    const init = () => {
        setupMobileMenu();
        setupSmoothScroll();
        setupHeroSlider();
        setupMemberCardInteraction();
        setupMemberCyclingInteraction();
        animateStats();
        setupJoinFormAnimation();
        setupEventPageToggle();
        setupRegisterForm();
    };

    // Run scripts when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', init);
})();
