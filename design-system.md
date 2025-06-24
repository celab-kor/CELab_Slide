# 재능기부프로젝트 슬라이드 디자인 시스템 가이드

> **프로젝트**: "비개발자도 #가능 간지나는 슬라이드 '똑딱' 작성법"  
> **폰트**: Pretendard  
> **비율**: 4:3 (1024x768px 기준)  
> **제작일**: 2025년 6월 24일  
> **총 슬라이드**: 21장

---

## 🎨 컬러 시스템

### 기본 컬러 팔레트 (기존 유지)
```css
Primary Purple: #673AB7 (Deep Purple)
Secondary Purple: #9C27B0 (Light Purple)  
Accent Purple: #B388FF (Soft Purple)
Tertiary: #3F51B5 (Indigo)

Background Black: #000000
Background Dark: #1a1a1a
Text White: #FFFFFF
Text Gray: #CCCCCC
Text Light Gray: #E0E0E0
```

### 그라데이션 조합 3가지

#### 1️⃣ **메인 타이틀용 그라데이션**
```css
/* 사용 대상: 주요 제목, 섹션 타이틀 */
background: linear-gradient(135deg, #673AB7 0%, #9C27B0 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

#### 2️⃣ **서브 텍스트용 그라데이션**
```css
/* 사용 대상: 발표자명, 부제목, 중요 텍스트 */
background: linear-gradient(90deg, #FFFFFF 0%, #B388FF 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

#### 3️⃣ **강조 박스용 그라데이션**
```css
/* 사용 대상: 배경 박스, 버튼 */
background: linear-gradient(90deg, #673AB7 0%, #9C27B0 50%, #3F51B5 100%);
box-shadow: 0 8px 24px rgba(103, 58, 183, 0.3);
```

---

## ✍️ 타이포그래피 시스템 (4:3 최적화)

### 폰트 패밀리
```css
font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
```

### 텍스트 계층 구조 (4:3 비율 최적화)

#### **레벨 1: 메인 타이틀** (2.8rem / 44.8px)
```css
font-size: 2.8rem;
font-weight: 800;
line-height: 1.2;
/* 그라데이션 1번 적용 */
```
**사용**: 슬라이드 대제목

#### **레벨 2: 섹션 타이틀** (2.4rem / 38.4px)
```css
font-size: 2.4rem;
font-weight: 800;
/* 그라데이션 1번 적용 */
```
**사용**: 챕터별 제목

#### **레벨 3: 발표자명** (2rem / 32px)
```css
font-size: 2rem;
font-weight: 700;
/* 그라데이션 2번 적용 */
```

#### **레벨 4: 서브 타이틀** (1.6rem / 25.6px)
```css
font-size: 1.6rem;
font-weight: 700;
/* 그라데이션 2번 적용 */
```

#### **레벨 5: 본문 강조** (1.3rem / 20.8px)
```css
font-size: 1.3rem;
font-weight: 700;
color: #FFFFFF;
```

#### **레벨 6: 본문 텍스트** (1.1rem / 17.6px)
```css
font-size: 1.1rem;
font-weight: 600;
line-height: 1.6;
color: #FFFFFF;
```

#### **레벨 7: 보조 텍스트** (0.9rem / 14.4px)
```css
font-size: 0.9rem;
font-weight: 500;
color: #CCCCCC;
```

---

## 📐 레이아웃 시스템 (4:3 전용)

### 슬라이드 기본 구조
```css
/* 전체 슬라이드 컨테이너 */
.slide-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
}

/* 실제 슬라이드 영역 (4:3 비율 유지) */
.slide {
    width: min(100vw, 133.33vh); /* 4:3 비율 계산 */
    height: min(75vw, 100vh);    /* 4:3 비율 계산 */
    aspect-ratio: 4 / 3;
    padding: 5% 6%;              /* 상하 5%, 좌우 6% */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
}
```

### 간격 시스템 (4:3 최적화)
```css
/* 여백 단위 */
--spacing-xs: 0.4rem;   /* 6.4px */
--spacing-sm: 0.8rem;   /* 12.8px */
--spacing-md: 1.6rem;   /* 25.6px */
--spacing-lg: 2.4rem;   /* 38.4px */
--spacing-xl: 3.2rem;   /* 51.2px */
```

---

## 🧩 컴포넌트 스타일

### 강조 박스 (Highlight Box)
```css
.highlight-box {
    background: linear-gradient(90deg, #673AB7 0%, #9C27B0 50%, #3F51B5 100%);
    padding: 1.6rem 2.4rem;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(103, 58, 183, 0.3);
    text-align: center;
    margin: var(--spacing-md) 0;
}
```

### 네비게이션 버튼
```css
.nav-button {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(103, 58, 183, 0.8);
    border: none;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 1000;
}

.nav-button:hover {
    background: rgba(103, 58, 183, 1);
    transform: translateY(-50%) scale(1.1);
}

.nav-button.prev { left: 2rem; }
.nav-button.next { right: 2rem; }
```

### 프로그래스 바
```css
.progress-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: rgba(26, 26, 26, 0.8);
    z-index: 1000;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #673AB7 0%, #9C27B0 100%);
    transition: width 0.3s ease;
    width: 0%;
}
```

### 슬라이드 넘버
```css
.slide-number {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: rgba(26, 26, 26, 0.8);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    color: #CCCCCC;
    font-size: 0.9rem;
    z-index: 1000;
}
```

---

## 📱 반응형 가이드라인 (4:3 유지)

### 브레이크포인트
```css
/* Desktop First 접근법 */
@media (max-width: 768px) {
    /* 태블릿 스타일 */
}

@media (max-width: 480px) {
    /* 모바일 스타일 */
}
```

### 태블릿 최적화 (768px 이하)
```css
/* 폰트 크기 조정 */
.main-title { font-size: 2.2rem; }      /* 2.8rem → 2.2rem */
.section-title { font-size: 2rem; }     /* 2.4rem → 2rem */
.presenter-name { font-size: 1.6rem; }  /* 2rem → 1.6rem */

/* 패딩 조정 */
.slide { 
    padding: 4% 5%;                     /* 5% 6% → 4% 5% */
}

/* 네비게이션 조정 */
.nav-button {
    width: 40px;
    height: 40px;
    font-size: 1rem;
}
.nav-button.prev { left: 1rem; }
.nav-button.next { right: 1rem; }
```

### 모바일 최적화 (480px 이하)
```css
/* 폰트 크기 조정 */
.main-title { font-size: 1.8rem; }      /* 2.2rem → 1.8rem */
.section-title { font-size: 1.6rem; }   /* 2rem → 1.6rem */
.presenter-name { font-size: 1.3rem; }  /* 1.6rem → 1.3rem */

/* 패딩 조정 */
.slide { 
    padding: 3% 4%;                     /* 4% 5% → 3% 4% */
}

/* 네비게이션 조정 */
.nav-button {
    width: 36px;
    height: 36px;
    font-size: 0.9rem;
}
.nav-button.prev { left: 0.5rem; }
.nav-button.next { right: 0.5rem; }
```

---

## 🎯 특별 지침

### 단순함 우선
- **텍스트 중심**: 복잡한 인포그래픽 지양
- **애니메이션**: 단순한 fade/slide 효과만 사용
- **색상**: 기존 퍼플 계열만 활용

### 4:3 비율 유지
```css
/* 핵심: aspect-ratio 속성으로 비율 강제 */
.slide {
    aspect-ratio: 4 / 3;
    width: min(100vw, 133.33vh);
    height: min(75vw, 100vh);
}
```

### 성능 최적화
- 바닐라 JS만 사용
- CSS 애니메이션 우선
- 이미지 최소화
- 가벼운 구조 유지

---

## 🔧 기술적 구현

### CSS 변수 시스템
```css
:root {
    /* 색상 */
    --primary-purple: #673AB7;
    --secondary-purple: #9C27B0;
    --accent-purple: #B388FF;
    --tertiary-indigo: #3F51B5;
    
    /* 배경 */
    --bg-black: #000000;
    --bg-dark: #1a1a1a;
    
    /* 텍스트 */
    --text-white: #FFFFFF;
    --text-gray: #CCCCCC;
    --text-light: #E0E0E0;
    
    /* 간격 (4:3 최적화) */
    --spacing-xs: 0.4rem;
    --spacing-sm: 0.8rem;
    --spacing-md: 1.6rem;
    --spacing-lg: 2.4rem;
    --spacing-xl: 3.2rem;
    
    /* 그라데이션 */
    --gradient-title: linear-gradient(135deg, var(--primary-purple) 0%, var(--secondary-purple) 100%);
    --gradient-text: linear-gradient(90deg, var(--text-white) 0%, var(--accent-purple) 100%);
    --gradient-box: linear-gradient(90deg, var(--primary-purple) 0%, var(--secondary-purple) 50%, var(--tertiary-indigo) 100%);
}
```

### 키보드 네비게이션
```javascript
// 기본 키 이벤트
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowRight':
        case ' ':           // 스페이스바
            nextSlide();
            break;
        case 'ArrowLeft':
            prevSlide();
            break;
    }
});
```
