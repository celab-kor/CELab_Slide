/**
 * 슬라이드 프레젠테이션 시스템 (slides.js)
 * 21개 슬라이드 네비게이션 및 인터랙션 관리
 * 바닐라 JS 구현, main.js 유틸리티 활용
 */

class SlidePresentation {
    constructor() {
        // 기본 설정
        this.currentSlide = 1;
        this.totalSlides = 21;
        this.isTransitioning = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        
        // DOM 요소 캐싱
        this.slides = [];
        this.progressBar = null;
        this.slideCounter = null;
        this.prevBtn = null;
        this.nextBtn = null;
        
        // 이벤트 추적
        this.eventTracker = [];
        
        // 초기화
        this.init();
    }
    
    /**
     * 초기화 메서드
     */
    init() {
        // DOM이 로드된 후 실행
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    /**
     * 설정 및 이벤트 바인딩
     */
    setup() {
        try {
            this.cacheElements();
            this.bindEvents();
            this.setupInitialState();
            this.trackEvent('presentation_loaded', {
                totalSlides: this.totalSlides,
                userAgent: navigator.userAgent,
                viewport: `${window.innerWidth}x${window.innerHeight}`
            });
            
            console.log('✅ 슬라이드 프레젠테이션 시스템 초기화 완료');
        } catch (error) {
            console.error('❌ 슬라이드 초기화 오류:', error);
            this.showFallbackNavigation();
        }
    }
    
    /**
     * DOM 요소 캐싱
     */
    cacheElements() {
        this.slides = Array.from(document.querySelectorAll('.slide'));
        this.progressBar = document.querySelector('.progress-bar');
        this.slideCounter = document.querySelector('.slide-counter');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        
        // 요소 검증
        if (this.slides.length === 0) {
            throw new Error('슬라이드 요소를 찾을 수 없습니다');
        }
        
        console.log(`📊 ${this.slides.length}개 슬라이드 요소 캐싱 완료`);
    }
    
    /**
     * 이벤트 바인딩
     */
    bindEvents() {
        // 키보드 이벤트
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // 마우스 이벤트
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevSlide());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // 클릭 영역 이벤트 (화면 좌우 클릭)
        document.addEventListener('click', (e) => this.handleClick(e));
        
        // 터치 이벤트 (모바일)
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        
        // 윈도우 이벤트
        window.addEventListener('resize', Utils.debounce(() => this.handleResize(), 250));
        window.addEventListener('beforeunload', () => this.saveState());
        
        // 브라우저 뒤로가기/앞으로가기
        window.addEventListener('popstate', (e) => this.handlePopState(e));
        
        console.log('🔗 모든 이벤트 리스너 바인딩 완료');
    }
    
    /**
     * 초기 상태 설정
     */
    setupInitialState() {
        // URL 해시에서 슬라이드 번호 확인
        const hash = window.location.hash;
        if (hash && hash.startsWith('#slide-')) {
            const slideNumber = parseInt(hash.replace('#slide-', ''));
            if (slideNumber >= 1 && slideNumber <= this.totalSlides) {
                this.currentSlide = slideNumber;
            }
        }
        
        // 첫 번째 슬라이드 표시
        this.showSlide(this.currentSlide, false);
        this.updateUI();
        
        console.log(`🎬 슬라이드 ${this.currentSlide} 표시 시작`);
    }
    
    /**
     * 키보드 이벤트 처리
     */
    handleKeyboard(e) {
        // 입력 필드에서는 키보드 네비게이션 비활성화
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch (e.key) {
            case 'ArrowRight':
            case ' ': // 스페이스바
                e.preventDefault();
                this.nextSlide();
                break;
                
            case 'ArrowLeft':
            case 'Backspace':
                e.preventDefault();
                this.prevSlide();
                break;
                
            case 'Home':
                e.preventDefault();
                this.goToSlide(1);
                break;
                
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
                
            case 'Escape':
                e.preventDefault();
                this.goToSlide(1);
                break;
                
            default:
                // 숫자키 1-9 처리
                if (e.key >= '1' && e.key <= '9') {
                    const slideNumber = parseInt(e.key);
                    if (slideNumber <= this.totalSlides) {
                        e.preventDefault();
                        this.goToSlide(slideNumber);
                    }
                }
                break;
        }
    }
    
    /**
     * 마우스 클릭 이벤트 처리
     */
    handleClick(e) {
        // 버튼이나 링크 클릭 시에는 네비게이션하지 않음
        if (e.target.closest('button, a, .nav-btn, .home-btn')) {
            return;
        }
        
        const rect = document.documentElement.getBoundingClientRect();
        const clickX = e.clientX;
        const centerX = rect.width / 2;
        
        if (clickX < centerX) {
            this.prevSlide();
        } else {
            this.nextSlide();
        }
        
        this.trackEvent('slide_click_navigation', {
            clickX: clickX,
            direction: clickX < centerX ? 'prev' : 'next',
            currentSlide: this.currentSlide
        });
    }
    
    /**
     * 터치 시작 이벤트
     */
    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
    }
    
    /**
     * 터치 종료 이벤트 (스와이프 감지)
     */
    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].clientX;
        this.touchEndY = e.changedTouches[0].clientY;
        
        this.handleSwipe();
    }
    
    /**
     * 스와이프 제스처 처리
     */
    handleSwipe() {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;
        const minSwipeDistance = 50;
        
        // 세로 스크롤이 가로 스와이프보다 큰 경우 무시
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            return;
        }
        
        if (Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                // 오른쪽 스와이프 → 이전 슬라이드
                this.prevSlide();
            } else {
                // 왼쪽 스와이프 → 다음 슬라이드
                this.nextSlide();
            }
            
            this.trackEvent('slide_swipe_navigation', {
                deltaX: deltaX,
                direction: deltaX > 0 ? 'prev' : 'next',
                currentSlide: this.currentSlide
            });
        }
    }
    
    /**
     * 창 크기 변경 처리
     */
    handleResize() {
        // 반응형 브레이크포인트 감지
        const breakpoint = ResponsiveHelper.getCurrentBreakpoint();
        
        this.trackEvent('viewport_change', {
            breakpoint: breakpoint,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            currentSlide: this.currentSlide
        });
    }
    
    /**
     * 브라우저 히스토리 이벤트 처리
     */
    handlePopState(e) {
        if (e.state && e.state.slide) {
            this.goToSlide(e.state.slide, false);
        }
    }
    
    /**
     * 다음 슬라이드로 이동
     */
    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        } else {
            // 마지막 슬라이드에서 다음 버튼 클릭 시 첫 번째로 (선택적)
            // this.goToSlide(1);
            
            // 또는 진동 효과로 끝임을 알림
            this.showEndOfPresentation();
        }
    }
    
    /**
     * 이전 슬라이드로 이동
     */
    prevSlide() {
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        } else {
            // 첫 번째 슬라이드에서 이전 버튼 클릭 시 마지막으로 (선택적)
            // this.goToSlide(this.totalSlides);
            
            // 또는 진동 효과로 시작임을 알림
            this.showStartOfPresentation();
        }
    }
    
    /**
     * 특정 슬라이드로 이동
     */
    goToSlide(slideNumber, updateHistory = true) {
        // 유효성 검사
        if (slideNumber < 1 || slideNumber > this.totalSlides) {
            console.warn(`⚠️ 잘못된 슬라이드 번호: ${slideNumber}`);
            return;
        }
        
        // 전환 중이면 무시
        if (this.isTransitioning) {
            return;
        }
        
        // 같은 슬라이드면 무시
        if (this.currentSlide === slideNumber) {
            return;
        }
        
        const previousSlide = this.currentSlide;
        this.currentSlide = slideNumber;
        
        this.showSlide(slideNumber, true);
        this.updateUI();
        
        // 브라우저 히스토리 업데이트
        if (updateHistory) {
            this.updateHistory();
        }
        
        // 이벤트 추적
        this.trackEvent('slide_navigation', {
            from: previousSlide,
            to: slideNumber,
            direction: slideNumber > previousSlide ? 'next' : 'prev'
        });
        
        console.log(`🎯 슬라이드 ${slideNumber} 표시 완료`);
    }
    
    /**
     * 슬라이드 표시
     */
    showSlide(slideNumber, animate = true) {
        this.isTransitioning = true;
        
        // 모든 슬라이드에서 애니메이션 클래스 제거
        this.slides.forEach(slide => {
            slide.classList.remove('active');
            this.removeAnimationClasses(slide);
        });
        
        // 애니메이션 지연 후 대상 슬라이드 활성화
        if (animate) {
            setTimeout(() => {
                const targetSlide = this.slides[slideNumber - 1];
                if (targetSlide) {
                    targetSlide.classList.add('active');
                    
                    // 섹션별 애니메이션 적용
                    this.triggerSlideAnimation(targetSlide);
                    
                    // 슬라이드에 포커스 설정 (접근성)
                    targetSlide.focus();
                }
                
                setTimeout(() => {
                    this.isTransitioning = false;
                }, 600); // 애니메이션 시간 고려하여 증가
            }, 50);
        } else {
            // 즉시 표시 (초기 로드)
            const targetSlide = this.slides[slideNumber - 1];
            if (targetSlide) {
                targetSlide.classList.add('active');
                // 초기 로드 시에도 애니메이션 적용
                setTimeout(() => this.triggerSlideAnimation(targetSlide), 100);
            }
            this.isTransitioning = false;
        }
    }
    
    /**
     * 섹션별 애니메이션 트리거
     */
    triggerSlideAnimation(slideElement) {
        const section = slideElement.getAttribute('data-section');
        if (!section) return;
        
        // 기존 애니메이션 클래스 제거
        this.removeAnimationClasses(slideElement);
        
        // 섹션별 애니메이션 클래스 추가
        const animationClass = `animate-${section}`;
        slideElement.classList.add(animationClass);
        
        // 리스트 아이템들에 index 설정 (순차 애니메이션용)
        this.setAnimationIndexes(slideElement);
        
        // 애니메이션 완료 후 클래스 제거 (재실행 가능하도록)
        setTimeout(() => {
            slideElement.classList.remove(animationClass);
        }, 2000);
        
        console.log(`🎭 ${section} 섹션 애니메이션 실행`);
    }
    
    /**
     * 애니메이션 클래스 제거
     */
    removeAnimationClasses(slideElement) {
        const animationClasses = [
            'animate-intro', 'animate-basic', 'animate-advanced',
            'animate-development', 'animate-deploy', 'animate-tips', 'animate-conclusion'
        ];
        
        animationClasses.forEach(className => {
            slideElement.classList.remove(className);
        });
    }
    
    /**
     * 순차 애니메이션을 위한 인덱스 설정
     */
    setAnimationIndexes(slideElement) {
        // 리스트 아이템들 찾기
        const items = slideElement.querySelectorAll(
            '.list-item, .highlight-box, .tool-item, .step-item, ' +
            '.method-item, .tip-item, .section-box, .point-item, .message-item'
        );
        
        // 각 아이템에 CSS 변수로 인덱스 설정
        items.forEach((item, index) => {
            item.style.setProperty('--item-index', index);
        });
    }
    
    /**
     * UI 업데이트 (프로그레스바, 카운터, 버튼 상태)
     */
    updateUI() {
        // 프로그레스바 업데이트
        if (this.progressBar) {
            const progress = (this.currentSlide / this.totalSlides) * 100;
            this.progressBar.style.width = `${progress}%`;
            this.progressBar.parentElement.setAttribute('aria-valuenow', progress);
        }
        
        // 슬라이드 카운터 업데이트
        if (this.slideCounter) {
            const currentSpan = this.slideCounter.querySelector('.current');
            const totalSpan = this.slideCounter.querySelector('.total');
            
            if (currentSpan) currentSpan.textContent = this.currentSlide;
            if (totalSpan) totalSpan.textContent = this.totalSlides;
        }
        
        // 네비게이션 버튼 상태 업데이트
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentSlide === 1;
            this.prevBtn.setAttribute('aria-disabled', this.currentSlide === 1);
        }
        
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentSlide === this.totalSlides;
            this.nextBtn.setAttribute('aria-disabled', this.currentSlide === this.totalSlides);
        }
        
        // 페이지 제목 업데이트
        const currentSlideElement = this.slides[this.currentSlide - 1];
        if (currentSlideElement) {
            const title = currentSlideElement.querySelector('h1, .main-title, .section-title');
            if (title) {
                document.title = `${title.textContent.trim()} - 재능기부프로젝트`;
            }
        }
    }
    
    /**
     * 브라우저 히스토리 업데이트
     */
    updateHistory() {
        const url = `#slide-${this.currentSlide}`;
        const state = { slide: this.currentSlide };
        
        history.pushState(state, '', url);
    }
    
    /**
     * 프레젠테이션 끝 알림
     */
    showEndOfPresentation() {
        if (this.nextBtn) {
            this.nextBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.nextBtn.style.transform = '';
            }, 150);
        }
        
        this.trackEvent('presentation_end_reached', {
            currentSlide: this.currentSlide
        });
    }
    
    /**
     * 프레젠테이션 시작 알림
     */
    showStartOfPresentation() {
        if (this.prevBtn) {
            this.prevBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.prevBtn.style.transform = '';
            }, 150);
        }
        
        this.trackEvent('presentation_start_reached', {
            currentSlide: this.currentSlide
        });
    }
    
    /**
     * 상태 저장 (새로고침 대비)
     */
    saveState() {
        try {
            const state = {
                currentSlide: this.currentSlide,
                timestamp: new Date().toISOString(),
                events: this.eventTracker.slice(-10) // 최근 10개 이벤트만
            };
            
            localStorage.setItem('slidePresentation_state', JSON.stringify(state));
        } catch (error) {
            console.warn('⚠️ 상태 저장 실패:', error);
        }
    }
    
    /**
     * 이벤트 추적
     */
    trackEvent(eventName, eventData = {}) {
        const event = {
            name: eventName,
            data: {
                ...eventData,
                timestamp: new Date().toISOString(),
                currentSlide: this.currentSlide,
                totalSlides: this.totalSlides,
                breakpoint: ResponsiveHelper.getCurrentBreakpoint(),
                userAgent: navigator.userAgent
            }
        };
        
        this.eventTracker.push(event);
        
        // 최대 50개 이벤트만 유지
        if (this.eventTracker.length > 50) {
            this.eventTracker = this.eventTracker.slice(-50);
        }
        
        console.log(`📊 이벤트 추적: ${eventName}`, eventData);
    }
    
    /**
     * 폴백 네비게이션 표시 (오류 시)
     */
    showFallbackNavigation() {
        console.warn('⚠️ 폴백 네비게이션 모드 활성화');
        
        // 기본 HTML 네비게이션 링크 생성
        const fallbackNav = document.createElement('div');
        fallbackNav.innerHTML = `
            <div style="position: fixed; bottom: 1rem; left: 50%; transform: translateX(-50%); 
                        background: rgba(0,0,0,0.8); padding: 1rem; border-radius: 8px; z-index: 1001;">
                <p style="color: white; margin: 0 0 0.5rem 0;">슬라이드 네비게이션:</p>
                <button onclick="history.back()" style="margin-right: 0.5rem;">◀ 이전</button>
                <button onclick="history.forward()">다음 ▶</button>
            </div>
        `;
        
        document.body.appendChild(fallbackNav);
    }
    
    /**
     * 프레젠테이션 정보 반환
     */
    getInfo() {
        return {
            currentSlide: this.currentSlide,
            totalSlides: this.totalSlides,
            isTransitioning: this.isTransitioning,
            eventCount: this.eventTracker.length,
            breakpoint: ResponsiveHelper.getCurrentBreakpoint()
        };
    }
}

/**
 * 키보드 단축키 도우미
 */
class KeyboardHelper {
    static showHelp() {
        const helpModal = document.createElement('div');
        helpModal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                        background: rgba(0,0,0,0.8); z-index: 2000; display: flex; 
                        align-items: center; justify-content: center;" onclick="this.remove()">
                <div style="background: #1a1a1a; padding: 2rem; border-radius: 8px; 
                            color: white; max-width: 400px;" onclick="event.stopPropagation()">
                    <h3 style="margin-top: 0; color: #B388FF;">키보드 단축키</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li>→ / Space: 다음 슬라이드</li>
                        <li>← / Backspace: 이전 슬라이드</li>
                        <li>1-9: 해당 번호 슬라이드</li>
                        <li>Home: 첫 번째 슬라이드</li>
                        <li>End: 마지막 슬라이드</li>
                        <li>ESC: 첫 번째 슬라이드</li>
                        <li>?: 이 도움말</li>
                    </ul>
                    <button onclick="this.parentElement.parentElement.remove()" 
                            style="background: #673AB7; color: white; border: none; 
                                   padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
                        닫기
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(helpModal);
    }
}

// 전역 인스턴스 생성
let slidePresentation;

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    slidePresentation = new SlidePresentation();
    
    // 개발자 도구용 전역 접근
    window.slidePresentation = slidePresentation;
    
    // 키보드 도움말 단축키
    document.addEventListener('keydown', (e) => {
        if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
            e.preventDefault();
            KeyboardHelper.showHelp();
        }
    });
    
    console.log('🎉 슬라이드 프레젠테이션 시스템 초기화 완료!');
    console.log('💡 개발자 도구에서 window.slidePresentation으로 접근 가능');
    console.log('❓ "?" 키로 키보드 단축키 도움말 표시');
});

// 오류 처리
window.addEventListener('error', (e) => {
    console.error('🚨 슬라이드 시스템 오류:', e.error);
    
    // 치명적인 오류 시 폴백 제공
    if (!slidePresentation) {
        document.body.innerHTML += `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background: #ff4444; color: white; padding: 2rem; border-radius: 8px; 
                        text-align: center; z-index: 3000;">
                <h3>슬라이드 로딩 오류</h3>
                <p>페이지를 새로고침해주세요.</p>
                <button onclick="location.reload()" 
                        style="background: white; color: #ff4444; border: none; 
                               padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
                    새로고침
                </button>
            </div>
        `;
    }
});