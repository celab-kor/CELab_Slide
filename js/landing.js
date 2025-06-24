/* ==========================================================================
   랜딩페이지 JavaScript - landing.js
   재능기부프로젝트: 비개발자도 #가능 간지나는 슬라이드 '똑딱' 작성법
   ========================================================================== */

// 랜딩페이지 전용 클래스
class LandingPage {
    constructor() {
        this.buttons = null;
        this.titleSection = null;
        this.actionSection = null;
        this.infoSection = null;
        
        this.init();
    }

    // 초기화
    init() {
        console.log('🏠 랜딩페이지 초기화 시작');
        
        // DOM 요소 캐싱
        this.cacheElements();
        
        // 이벤트 리스너 등록
        this.setupEventListeners();
        
        // 초기 애니메이션 시작
        this.startInitialAnimations();
        
        // 성능 모니터링
        this.trackPerformance();
        
        console.log('✅ 랜딩페이지 초기화 완료');
    }

    // DOM 요소들 캐싱
    cacheElements() {
        this.buttons = {
            primary: document.querySelector('.primary-button'),
            secondary: document.querySelector('.secondary-button')
        };
        
        this.sections = {
            title: document.querySelector('.title-section'),
            action: document.querySelector('.action-section'),
            info: document.querySelector('.info-section')
        };
        
        this.landingContent = document.querySelector('.landing-content');
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 첫 번째 버튼: 하프노마드 소개 (외부 링크)
        if (this.buttons.primary) {
            this.buttons.primary.addEventListener('click', (e) => {
                e.preventDefault();
                this.handlePrimaryButtonClick();
            });
        }

        // 두 번째 버튼: 강의안 바로가기 (내부 링크)
        if (this.buttons.secondary) {
            this.buttons.secondary.addEventListener('click', (e) => {
                this.handleSecondaryButtonClick(e);
            });
        }

        // 키보드 네비게이션
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        // 반응형 처리
        ResponsiveHelper.onBreakpointChange((breakpoint) => {
            this.handleBreakpointChange(breakpoint);
        });
    }

    // 첫 번째 버튼 클릭 처리 (하프노마드 소개)
    handlePrimaryButtonClick() {
        console.log('👋 하프노마드 소개 링크 클릭');
        
        // 클릭 애니메이션
        this.animateButtonClick(this.buttons.primary);
        
        // 외부 링크 열기 (0.2초 후)
        setTimeout(() => {
            const url = 'https://litt.ly/half_nomad';
            window.open(url, '_blank', 'noopener,noreferrer');
            
            // 이벤트 추적 (필요시)
            this.trackEvent('external_link_click', {
                destination: 'half_nomad_profile',
                url: url
            });
        }, 200);
    }

    // 두 번째 버튼 클릭 처리 (강의안 바로가기)
    handleSecondaryButtonClick(e) {
        console.log('📚 강의안 바로가기 클릭');
        
        // 클릭 애니메이션
        this.animateButtonClick(this.buttons.secondary);
        
        // slides.html이 존재하는지 확인 후 이동
        const slidesUrl = 'slides.html';
        
        // 이벤트 추적
        this.trackEvent('internal_link_click', {
            destination: 'slides_viewer',
            url: slidesUrl
        });
        
        // 0.3초 후 페이지 이동 (애니메이션 완료 후)
        setTimeout(() => {
            window.location.href = slidesUrl;
        }, 300);
        
        // 기본 클릭 동작 일시 지연
        e.preventDefault();
    }

    // 버튼 클릭 애니메이션
    animateButtonClick(button) {
        if (!button) return;
        
        // 클릭 효과 클래스 추가
        button.style.transform = 'translateY(-2px) scale(0.98)';
        button.style.transition = 'all 0.1s ease';
        
        setTimeout(() => {
            button.style.transform = 'translateY(-4px) scale(1)';
            button.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 100);
    }

    // 키보드 네비게이션
    handleKeyboardNavigation(e) {
        switch(e.key) {
            case '1':
                // 숫자 1키로 첫 번째 버튼 클릭
                if (this.buttons.primary) {
                    this.buttons.primary.click();
                }
                break;
            case '2':
            case ' ': // 스페이스바
                // 숫자 2키나 스페이스바로 두 번째 버튼 클릭
                if (this.buttons.secondary) {
                    this.buttons.secondary.click();
                }
                break;
            case 'Enter':
                // 엔터키로 현재 포커스된 버튼 클릭
                const focusedButton = document.activeElement;
                if (focusedButton && focusedButton.classList.contains('action-button')) {
                    focusedButton.click();
                }
                break;
        }
    }

    // 브레이크포인트 변경 처리
    handleBreakpointChange(breakpoint) {
        console.log(`📱 브레이크포인트 변경: ${breakpoint}`);
        
        // 모바일에서 추가 최적화
        if (breakpoint === 'mobile') {
            this.optimizeForMobile();
        }
    }

    // 모바일 최적화
    optimizeForMobile() {
        // 터치 이벤트 최적화
        if ('ontouchstart' in window) {
            document.querySelectorAll('.action-button').forEach(button => {
                button.addEventListener('touchstart', function() {
                    this.style.transform = 'translateY(-2px) scale(0.98)';
                }, { passive: true });
                
                button.addEventListener('touchend', function() {
                    this.style.transform = '';
                }, { passive: true });
            });
        }
    }

    // 초기 애니메이션 시작
    startInitialAnimations() {
        // CSS 애니메이션은 이미 설정되어 있으므로 
        // 추가적인 JavaScript 기반 애니메이션만 처리
        
        // 랜딩 컨테이너 페이드인
        if (this.landingContent) {
            this.landingContent.style.opacity = '0';
            
            requestAnimationFrame(() => {
                this.landingContent.style.transition = 'opacity 0.8s ease';
                this.landingContent.style.opacity = '1';
            });
        }
    }

    // 이벤트 추적 (분석용)
    trackEvent(eventName, properties = {}) {
        // 실제 환경에서는 Google Analytics, Mixpanel 등 연동
        console.log(`📊 이벤트 추적: ${eventName}`, properties);
        
        // 기본 추적 정보
        const trackingData = {
            event: eventName,
            timestamp: new Date().toISOString(),
            page: 'landing',
            breakpoint: ResponsiveHelper.getCurrentBreakpoint(),
            ...properties
        };
        
        // 로컬 스토리지에 저장 (데모용)
        try {
            const existingEvents = JSON.parse(localStorage.getItem('slideProject_events') || '[]');
            existingEvents.push(trackingData);
            
            // 최대 50개까지만 보관
            if (existingEvents.length > 50) {
                existingEvents.splice(0, existingEvents.length - 50);
            }
            
            localStorage.setItem('slideProject_events', JSON.stringify(existingEvents));
        } catch (error) {
            console.warn('이벤트 추적 저장 실패:', error);
        }
    }

    // 성능 모니터링
    trackPerformance() {
        // 페이지 로드 성능 측정
        window.addEventListener('load', () => {
            if ('performance' in window) {
                const loadTime = performance.now();
                console.log(`⚡ 페이지 로드 시간: ${Math.round(loadTime)}ms`);
                
                this.trackEvent('page_load_performance', {
                    load_time: Math.round(loadTime),
                    is_mobile: ResponsiveHelper.getCurrentBreakpoint() === 'mobile'
                });
            }
        });
    }
}

// DOM 로드 완료 후 랜딩페이지 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 랜딩페이지인지 확인
    if (document.querySelector('.landing-container')) {
        window.landingPage = new LandingPage();
    }
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    if (window.landingPage) {
        console.log('👋 랜딩페이지 정리 완료');
    }
});