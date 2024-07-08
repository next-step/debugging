# 📂 파일 업로드 검증 로직 디버깅 실습 가이드

# 🎯 학습 목표

파일 업로드 검증 로직의 버그를 발견하고 수정하는 과정을 경험한다.

# 🏃🏻 핵심 경험

실제 개발 상황과 유사한 시나리오에서 디버깅 과정을 체계적으로 진행하는 경험을 한다.

# 📝 실습 가이드

## 0. 실습 시나리오

### 🪲 버그 리포트

**제목**: 프로필 이미지 업로드 시 비허용 파일 확장자 업로드 가능

**설명**:
프로필 이미지 업로드 기능 테스트 중 파일 확장자 검증에 문제가 있음을 발견하였습니다. 현재 JPG, PNG, GIF 파일 외에도 TXT, PDF 등 다양한 확장자의 파일들이 업로드 가능한 상태입니다. 이는 의도하지 않은 파일들이 업로드될 수 있는 보안 이슈로 이어질 수 있습니다. 파일 확장자 검증 로직을 빠르게 수정하여 허용된 이미지 파일 확장자만 업로드될 수 있도록 조치가 필요합니다.

## 1. 개발 환경 설정

### 1. Node.js 설치

- Node.js 공식 웹사이트([https://nodejs.org](https://nodejs.org))에서 안정화 버전을 다운로드하여 설치합니다.

### 2. nodemon 설치

nodemon은 Node.js 애플리케이션의 소스 코드 변경을 감지하고 자동으로 서버를 재시작해주는 도구입니다. 개발 과정에서 코드를 수정할 때마다 수동으로 서버를 재시작할 필요 없이 nodemon을 사용하면 편리하게 개발할 수 있습니다.

터미널에서 다음 명령어를 실행하여 nodemon을 전역으로 설치합니다.

```bash
npm install -g nodemon
```

### 3. 프로젝트 클론 및 설치

터미널에서 다음 명령어를 실행하여 프로젝트를 클론합니다.

```bash
git clone https://github.com/next-step/debugging
```

터미널에서 다음 명령어를 실행하여 프로젝트의 의존성을 설치합니다.

```bash
npm install
```

### 4. 기본 코드 설명

- 다음은 파일 업로드를 처리하는 간단한 Express 서버의 기본 코드입니다.

```jsx
// app.js
const express = require("express");
const multer = require("multer");
const app = express();

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  res.send("File uploaded successfully.");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
```

### 코드 설명

- `express`: Node.js를 위한 웹 프레임워크입니다.
- `multer`: 파일 업로드를 처리하기 위한 미들웨어입니다.
- `app.post("/upload", upload.single("file"), ...)`: `/upload` 엔드포인트에서 파일을 업로드합니다.
- `if (!req.file)`: 업로드된 파일이 없는 경우 에러를 반환합니다.
- `res.send("File uploaded successfully.")`: 파일 업로드가 성공적으로 이루어진 경우 메시지를 반환합니다.
- `app.listen(3000, ...)`: 서버를 포트 3000에서 시작합니다.

## 2. Postman을 이용한 테스트

### **목적**

파일 업로드 로직이 특정 확장자만 허용하도록 제대로 동작하는지 확인합니다. 허용된 확장자(.jpg, .png)의 파일만 업로드가 성공적으로 이루어지는지, 허용되지 않은 확장자(.svg, .pdf)의 파일이 업로드 시 적절한 에러 메시지가 반환되는지 확인합니다.

### 1. VSCode 플러그인으로 Postman 설치

- VSCode에서 Extensions 아이콘을 클릭하고 Postman 플러그인을 설치합니다.

### 2. 서버 실행

터미널에서 다음 명령어를 실행하여 서버를 실행합니다.

```bash
npm run dev
```

### 3. Postman을 사용하여 테스트

**Postman 설정**

- Postman을 열고 `http://127.0.0.1:3000/upload` URL로 POST 요청을 설정합니다.
- Body 탭에서 form-data를 선택하고, key를 'file', type을 'File'로 설정하여 다음 파일들을 하나씩 업로드합니다.
  - `thumbnail.jpg`
  - `thumbnail.png`
  - `thumbnail.svg`
  - `thumbnail.pdf`

## 4. 디버깅 마인드셋 템플릿을 활용한 문제 해결

이제 디버깅 마인드셋 템플릿을 활용하여 파일 업로드 검증 로직의 버그를 단계적으로 파악하고 해결해보겠습니다. 각 단계에서 어떤 작업을 수행해야 하는지 가이드를 제공하니, 실제로 문제를 해결하는 과정은 여러분이 직접 수행해보시기 바랍니다.

### Step 1: 문제 정의

현재 풀고자 하는 문제를 한 문장으로 명확하게 정의해보세요.

### Step 2: 올바른 동작 정의

파일 업로드 기능이 올바르게 동작한다면 어떤 일이 벌어져야 하는지 정의해보세요. 이를 명확하게 정의하기 위해 올바른 동작을 given, when, then 형식으로 기술해보세요.

### Step 3: 최소 재현 환경 구축하며 관찰

문제가 발생한 시점을 정확히 확인 후 내 환경에서 직접 재현하기 위해 문제가 있는 부분을 격리시켜보세요. 그리고 재현 환경과 정상 동작의 차이점을 관찰하고, 관찰한 내용을 적어보세요.

### Step 4: 차이를 발생시키는 다양한 원인 탐색

Step 3에서 관찰한 차이를 발생시키는 원인이 될 만한 옵션들을 자유롭게 적어보세요. 옵션을 적기 어렵다면 추가 정보를 수집해보세요.

### Step 5: 가설 설정 및 검증

Step 4에서 도출한 옵션 중 하나를 선택하여 검증 가능한 가설을 세워보세요. 그리고 코드에 작은 변경을 가하면서 가설대로 현상이 변하는지 관찰해보세요.

만약 가설이 틀렸다면 그 이유를 적어보고, 다른 가설로 넘어가 반복해보세요.

<details>
<summary>힌트</summary>

- `path.extname()` 함수를 사용하면 파일의 확장자를 추출할 수 있습니다.
- `.includes()` 메서드를 사용하면 배열에 특정 값이 포함되어 있는지 확인할 수 있습니다.

```jsx
const path = require("path");

const fileExtension = path.extname(file.originalname);
```

</details>
