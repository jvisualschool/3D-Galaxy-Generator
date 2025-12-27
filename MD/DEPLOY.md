# 배포 가이드

이 프로젝트는 Vite로 빌드된 정적 웹사이트입니다. 다양한 플랫폼에 배포할 수 있습니다.

## 📦 빌드하기

먼저 프로젝트를 빌드합니다:

```bash
npm run build
```

빌드가 완료되면 `dist` 폴더에 배포 가능한 파일들이 생성됩니다.

로컬에서 빌드 결과를 미리 확인하려면:

```bash
npm run preview
```

---

## 🚀 배포 옵션

### 1. Vercel (추천 - 가장 쉬움)

**장점**: 무료, 자동 배포, GitHub 연동 쉬움

1. **Vercel 계정 생성**
   - [vercel.com](https://vercel.com) 접속
   - GitHub 계정으로 로그인

2. **프로젝트 배포**
   ```bash
   # Vercel CLI 설치
   npm i -g vercel
   
   # 배포
   vercel
   ```
   
   또는 웹사이트에서:
   - "New Project" 클릭
   - GitHub 저장소 선택
   - 프레임워크: Vite 자동 감지
   - "Deploy" 클릭

3. **설정 파일 (선택사항)**
   `vercel.json` 파일 생성:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "devCommand": "npm run dev",
     "installCommand": "npm install"
   }
   ```

---

### 2. Netlify

**장점**: 무료, 드래그 앤 드롭 배포, GitHub 연동

1. **웹사이트에서 배포**
   - [netlify.com](https://netlify.com) 접속
   - "Add new site" → "Deploy manually"
   - `dist` 폴더를 드래그 앤 드롭

2. **GitHub 연동**
   - "Add new site" → "Import an existing project"
   - GitHub 저장소 선택
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **설정 파일 (선택사항)**
   `netlify.toml` 파일 생성:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

---

### 3. GitHub Pages

**장점**: 무료, GitHub 저장소와 통합

1. **GitHub Actions 설정**
   `.github/workflows/deploy.yml` 파일 생성:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm install
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

2. **vite.config.js 수정**
   ```js
   export default {
     base: '/갤럭시/', // 저장소 이름
     // ... 나머지 설정
   }
   ```

3. **GitHub 저장소 설정**
   - Settings → Pages
   - Source: GitHub Actions 선택

---

### 4. 일반 정적 호스팅 서버

**FTP/SFTP를 통한 배포**

1. **빌드**
   ```bash
   npm run build
   ```

2. **파일 업로드**
   - `dist` 폴더의 모든 파일을 서버의 웹 루트 디렉토리에 업로드
   - 예: `/var/www/html/` 또는 `/public_html/`

3. **서버 설정 (Nginx 예시)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/html;
       index index.html;
   
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

---

### 5. Cloudflare Pages

**장점**: 무료, 빠른 CDN, GitHub 연동

1. **Cloudflare 계정 생성**
   - [pages.cloudflare.com](https://pages.cloudflare.com) 접속

2. **프로젝트 연결**
   - "Create a project" 클릭
   - GitHub 저장소 선택
   - Build command: `npm run build`
   - Build output directory: `dist`

---

## 🔧 배포 전 체크리스트

- [ ] `npm run build` 성공 확인
- [ ] `npm run preview`로 로컬에서 빌드 결과 확인
- [ ] 모든 기능이 정상 작동하는지 확인
- [ ] 환경 변수가 필요한 경우 설정 확인
- [ ] CORS 설정 확인 (필요시)

---

## 📝 환경별 설정

### 개발 환경
```bash
npm run dev
```

### 프로덕션 빌드
```bash
npm run build
```

### 프로덕션 미리보기
```bash
npm run preview
```

---

## 🐛 문제 해결

### 빌드 실패
- `node_modules` 삭제 후 재설치: `rm -rf node_modules && npm install`
- Node.js 버전 확인 (권장: 18.x 이상)

### 배포 후 404 에러
- SPA 라우팅 설정 확인
- 서버에서 모든 경로를 `index.html`로 리다이렉트 설정 필요

### 리소스 로드 실패
- `vite.config.js`의 `base` 설정 확인
- 상대 경로 사용 시 `base: './'` 확인

---

## 💡 추천 배포 플랫폼

1. **Vercel** - 가장 쉬움, 자동 배포
2. **Netlify** - 드래그 앤 드롭 배포
3. **GitHub Pages** - GitHub 사용자에게 적합

각 플랫폼은 무료 플랜을 제공하며, GitHub 저장소와 연동하면 자동 배포가 가능합니다.

