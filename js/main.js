/* ==========================================================================
   공통 JavaScript - main.js
   재능기부프로젝트: 비개발자도 #가능 간지나는 슬라이드 '똑딱' 작성법
   ========================================================================== */

// 공통 유틸리티 함수들
const Utils = {
    // 디바운스 함수 (성능 최적화)
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 요소가 뷰포트에 있는지 확인
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // 부드러운 스크롤
    smoothScrollTo(target, duration = 800) {
        const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
        if (!targetElement) return;

        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        // 이징 함수 (부드러운 애니메이션)
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    },

    // 외부 링크 안전 처리
    handleExternalLink(url) {
        // 외부 링크 열기 전 확인 (보안상)
        const confirmed = true; // 여기서는 바로 열기
        if (confirmed) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }
};

// 페이지 로드 완료 시 공통 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 재능기부프로젝트 로드 완료!');
    
    // 페이드인 애니메이션 시작
    document.body.classList.add('loaded');
    
    // 공통 키보드 이벤트 (ESC키로 모달 닫기 등)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // 모달이나 오버레이가 있다면 닫기
            const modals = document.querySelectorAll('.modal, .overlay');
            modals.forEach(modal => {
                if (modal.style.display !== 'none') {
                    modal.style.display = 'none';
                }
            });
        }
    });
});

// 페이지 로드 상태 관리
window.addEventListener('load', function() {
    // 모든 리소스 로드 완료
    console.log('✅ 모든 리소스 로드 완료');
    
    // 로딩 스피너가 있다면 제거
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }
});

// 에러 핸들링
window.addEventListener('error', function(e) {
    console.error('❌ 오류 발생:', e.error);
    // 사용자에게 친화적인 에러 메시지 표시 (프로덕션에서)
});

// 반응형 디자인 도움 함수들
const ResponsiveHelper = {
    // 현재 브레이크포인트 확인
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        if (width <= 480) return 'mobile';
        if (width <= 768) return 'tablet';
        return 'desktop';
    },

    // 브레이크포인트 변경 감지
    onBreakpointChange(callback) {
        let currentBreakpoint = this.getCurrentBreakpoint();
        
        const checkBreakpoint = Utils.debounce(() => {
            const newBreakpoint = this.getCurrentBreakpoint();
            if (newBreakpoint !== currentBreakpoint) {
                currentBreakpoint = newBreakpoint;
                callback(newBreakpoint);
            }
        }, 250);

        window.addEventListener('resize', checkBreakpoint);
        return checkBreakpoint;
    }
};

// 애니메이션 도움 함수들
const AnimationHelper = {
    // 요소 페이드인
    fadeIn(element, duration = 500) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
    },

    // 요소 슬라이드업
    slideUp(element, duration = 500) {
        element.style.transform = 'translateY(30px)';
        element.style.opacity = '0';
        element.style.transition = `all ${duration}ms ease`;
        
        requestAnimationFrame(() => {
            element.style.transform = 'translateY(0)';
            element.style.opacity = '1';
        });
    }
};