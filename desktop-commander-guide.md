# 🚨 Desktop Commander 사용 가이드

> **프로젝트**: 재능기부 슬라이드 제작  
> **목적**: Desktop Commander MCP 사용 시 시행착오 방지  
> **작성일**: 2025-06-25

---

## **📁 프로젝트 작업 경로**
```
C:/Users/mokka/Claude-project/Claude-slide
```

---

## **🚨 핵심 문제와 해결책**

### **❌ 문제 1: Desktop Commander가 Claude Desktop 앱 폴더에서 시작**
```powershell
# 문제 상황
pwd  # 결과: C:\Users\mokka\AppData\Local\AnthropicClaude\app-0.10.38
```

**원인**: Desktop Commander MCP가 Claude Desktop 앱의 실행 디렉토리에서 시작됨

### **❌ 문제 2: PowerShell 세션 분리**
```powershell
# 잘못된 방법 (각 명령이 새로운 세션에서 실행)
execute_command: cd C:/project/folder
execute_command: git status  # 원래 위치에서 실행됨
```

### **❌ 문제 3: 경로 구분자와 체인 명령 오류**
```powershell
# PowerShell에서 오류 발생
cd C:/path && git add .  # && 연산자 구문 오류
```

---

## **✅ 올바른 Desktop Commander 사용법**

### **1️⃣ 디렉토리 이동 + 작업 (한 번에)**
```powershell
# 올바른 패턴
Set-Location "C:\Users\mokka\Claude-project\Claude-slide"; git status
Set-Location "C:\Users\mokka\Claude-project\Claude-slide"; git add .
Set-Location "C:\Users\mokka\Claude-project\Claude-slide"; git commit -m "메시지"
```

### **2️⃣ Git 워크플로우 표준 패턴**
```powershell
# 상태 확인
Set-Location "C:\Users\mokka\Claude-project\Claude-slide"; git status

# 파일 추가 및 커밋 (체인)
Set-Location "C:\Users\mokka\Claude-project\Claude-slide"; git add .; git commit -m "[작업내용] 구체적 설명"

# 푸시
Set-Location "C:\Users\mokka\Claude-project\Claude-slide"; git push origin main
```

### **3️⃣ 파일 작업 시 절대 경로 사용**
```bash
# 올바른 방법
read_file: C:/Users/mokka/Claude-project/Claude-slide/project-plan.md
create_vault_file: C:/Users/mokka/Claude-project/Claude-slide/new-file.md
text-editor: C:/Users/mokka/Claude-project/Claude-slide/index.html
```

---

## **📋 표준 작업 체크리스트**

### **모든 작업 시작 전**
1. [ ] **프로젝트 상태 확인**
   ```powershell
   Set-Location "C:\Users\mokka\Claude-project\Claude-slide"; pwd; ls
   ```

2. [ ] **project-plan.md 읽기**
   ```bash
   read_file: C:/Users/mokka/Claude-project/Claude-slide/project-plan.md
   ```

3. [ ] **Git 상태 확인**
   ```powershell
   Set-Location "C:\Users\mokka\Claude-project\Claude-slide"; git status
   ```

### **작업 완료 후**
1. [ ] **변경사항 확인**
   ```powershell
   Set-Location "C:\Users\mokka\Claude-project\Claude-slide"; git diff
   ```

2. [ ] **파일 추가 및 커밋**
   ```powershell
   Set-Location "C:\Users\mokka\Claude-project\Claude-slide"; git add .; git commit -m "[작업내용] 설명"
   ```

3. [ ] **푸시**
   ```powershell
   Set-Location "C:\Users\mokka\Claude-project\Claude-slide"; git push origin main
   ```

4. [ ] **project-plan.md 업데이트**
   ```bash
   text-editor: C:/Users/mokka/Claude-project/Claude-slide/project-plan.md
   ```

---

## **🛠️ 트러블슈팅**

### **문제**: "파일을 찾을 수 없습니다"
```bash
# 해결책: 절대 경로 사용
read_file: C:/Users/mokka/Claude-project/Claude-slide/파일명
```

### **문제**: Git 명령이 다른 폴더에서 실행됨
```powershell
# 해결책: Set-Location 체인 사용
Set-Location "C:\Users\mokka\Claude-project\Claude-slide"; git 명령
```

### **문제**: PowerShell 구문 오류
```powershell
# 잘못된 방법
cd path && command

# 올바른 방법
Set-Location "path"; command
```

---

## **⚡ 빠른 명령어 참조**

### **자주 사용하는 명령 패턴**
```powershell
# 프로젝트 상태 확인
Set-Location "C:\Users\mokka\Claude-project\Claude-slide"; pwd; git status

# 빠른 커밋 및 푸시
Set-Location "C:\Users\mokka\Claude-project\Claude-slide"; git add .; git commit -m "메시지"; git push origin main

# 파일 목록 확인
Set-Location "C:\Users\mokka\Claude-project\Claude-slide"; ls
```

### **절대 경로 템플릿**
```
프로젝트 루트: C:/Users/mokka/Claude-project/Claude-slide
HTML 파일: C:/Users/mokka/Claude-project/Claude-slide/index.html
CSS 파일: C:/Users/mokka/Claude-project/Claude-slide/css/landing.css
JS 파일: C:/Users/mokka/Claude-project/Claude-slide/js/landing.js
계획서: C:/Users/mokka/Claude-project/Claude-slide/project-plan.md
```

---

## **🎯 핵심 원칙**

1. **항상 Set-Location 사용**: `cd` 대신 `Set-Location` 사용
2. **체인 명령 활용**: 세미콜론(`;`)으로 명령 연결  
3. **절대 경로 강제**: 상대 경로 사용 금지
4. **작업 전 상태 확인**: pwd, git status로 현재 위치 확인
5. **즉시 커밋**: 작업 완료 후 바로 Git 커밋

---

**이 가이드를 따르면 Desktop Commander 사용 시 디렉토리 문제가 100% 해결됩니다!** 🚀
