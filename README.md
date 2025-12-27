# 🌌 3D Galaxy Generator

Three.js를 사용한 인터랙티브 3D 갤럭시 생성기입니다. 실시간으로 파라미터를 조정하여 다양한 형태의 갤럭시를 생성하고 탐색할 수 있습니다.

🔗 **라이브 데모**: [https://jvibeschool.org/GALAXY/](https://jvibeschool.org/GALAXY/)

---

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| 🌌 **동적 갤럭시 생성** | 수십만 개의 파티클로 구성된 3D 갤럭시 시뮬레이션 |
| 🎨 **커스텀 셰이더** | GLSL 셰이더를 사용한 고성능 렌더링 |
| 💫 **블룸 효과** | UnrealBloomPass를 활용한 아름다운 빛 번짐 효과 |
| 🎛️ **실시간 조정** | GUI를 통한 실시간 파라미터 조정 |
| 🎭 **5가지 프리셋** | 미리 정의된 갤럭시 스타일 (버튼으로 빠른 전환) |
| 🖱️ **인터랙티브 카메라** | OrbitControls를 사용한 자유로운 시점 조작 |
| 🖥️ **전체화면 모드** | 몰입감 있는 전체화면 감상 지원 |
| 📊 **FPS 모니터** | 실시간 성능 모니터링 |
| 📱 **반응형 디자인** | 다양한 화면 크기에 최적화 |

---

## 🚀 시작하기

### 필수 요구사항

- Node.js 16 이상
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
# 개발 모드 실행
npm run dev
```

브라우저에서 `http://localhost:5173` (또는 Vite가 지정한 포트)로 접속하세요.

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

---

## 🎮 사용 방법

### 기본 조작

| 입력 | 동작 |
|------|------|
| **마우스 드래그** | 카메라 회전 |
| **마우스 휠** | 줌 인/아웃 |
| **더블클릭** | 전체화면 전환 |
| **F 키** | 전체화면 전환 |
| **ESC 키** | 전체화면 종료 |
| **왼쪽 하단 버튼** | 전체화면 토글 |

### UI 요소

- **오른쪽 상단**: Galaxy Controls 패널
  - 프리셋 버튼 (가로 배치)
  - 갤럭시 파라미터 슬라이더
  - 컬러 피커 (Inside / Outside 가로 배치)
  - Bloom Effect 조정
  - 정보 아이콘 [i] - Google 학습 링크
- **왼쪽 상단**: FPS 모니터 (성능에 따라 색상 변경)
- **왼쪽 하단**: 전체화면 버튼

---

## 🎛️ 파라미터

### 갤럭시 파라미터

| 파라미터 | 범위 | 설명 |
|----------|------|------|
| **Count** | 100 ~ 1,000,000 | 파티클 개수 |
| **Size** | 0.001 ~ 0.1 | 파티클 크기 |
| **Radius** | 0.01 ~ 20 | 갤럭시 반경 |
| **Branches** | 2 ~ 20 | 나선 팔 개수 |
| **Spin** | -5 ~ 5 | 회전 강도 |
| **Randomness** | 0 ~ 2 | 랜덤성 정도 |
| **Randomness Power** | 1 ~ 10 | 랜덤성 분포 |
| **Inside Color** | - | 중심부 색상 |
| **Outside Color** | - | 외곽부 색상 |

### 블룸 효과 파라미터

| 파라미터 | 범위 | 설명 |
|----------|------|------|
| **Strength** | 0 ~ 3 | 빛 강도 |
| **Radius** | 0 ~ 1 | 빛 반경 |
| **Threshold** | 0 ~ 1 | 임계값 |

### 프리셋

| 프리셋 | 설명 |
|--------|------|
| **Classic Spiral** | 클래식한 나선 갤럭시 |
| **Supernova** | 초신성 폭발 스타일 |
| **Ghostly** | 유령 같은 분위기 |
| **Black Hole** | 블랙홀 스타일 |
| **Nebula** | 성운 스타일 |

---

## 📁 프로젝트 구조

```
.
├── src/
│   ├── galaxy-leva.js         # 갤럭시 생성 로직 (메인)
│   ├── main-leva.js           # 메인 진입점
│   └── shaders/
│       └── galaxy/
│           ├── vertex.glsl    # 버텍스 셰이더
│           └── fragment.glsl  # 프래그먼트 셰이더
├── style.css                  # 스타일시트 (전체화면 지원)
├── index.html                 # 메인 HTML
├── package.json
├── vite.config.js
└── .agent/workflows/deploy.md # 배포 워크플로우
```

---

## 🛠️ 기술 스택

| 기술 | 버전 | 용도 |
|------|------|------|
| **Three.js** | v0.160.0 | 3D 그래픽 라이브러리 |
| **Vite** | v5.0.0 | 빌드 도구 및 개발 서버 |
| **GLSL** | - | 커스텀 셰이더 |
| **UnrealBloomPass** | - | 포스트 프로세싱 |

---

## 🎨 셰이더

### 버텍스 셰이더
- 시간 기반 회전 애니메이션
- 거리 기반 각도 오프셋 계산
- 랜덤성 적용
- 동적 포인트 크기 조정

### 프래그먼트 셰이더
- 원형 그라데이션 패턴
- 거리 기반 강도 계산
- 색상 믹싱

---

## 📦 배포

### 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다. 정적 호스팅 서비스(Netlify, Vercel, GitHub Pages 등)에 배포할 수 있습니다.

### 라이브 데모

🔗 **데모**: [https://jvibeschool.org/GALAXY/](https://jvibeschool.org/GALAXY/)

---

## 🔧 커스터마이징

### 새로운 프리셋 추가

`src/galaxy-leva.js` 파일의 `setupDebug()` 메서드에서 `presets` 객체에 새로운 프리셋을 추가할 수 있습니다:

```javascript
const presets = {
    'My Custom Preset': {
        count: 200000,
        size: 0.01,
        radius: 6,
        branches: 4,
        spin: 1.5,
        randomness: 0.5,
        randomnessPower: 3,
        insideColor: '#ff0000',
        outsideColor: '#0000ff'
    }
}
```

### 셰이더 수정

`src/shaders/galaxy/` 디렉토리의 GLSL 파일을 수정하여 렌더링 효과를 변경할 수 있습니다.

---


## 🙏 감사의 말

- [Three.js](https://threejs.org/) - 강력한 3D 라이브러리
- [Bruno Simon](https://bruno-simon.com/) - Three.js 학습 자료 제공

---

**© 2026 Jinho Jung**
