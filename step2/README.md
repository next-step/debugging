# 📂 스텝 2: 다중 파일 업로드 검증 로직 디버깅 실습 가이드

# 🎯 학습 목표

다중 파일 업로드 검증 로직의 버그를 발견하고 수정하는 과정을 경험합니다.

# 📝 실습 가이드

## 1. 실습 시나리오

### 🪲 버그 리포트

**제목**: 다중 파일 업로드 시 일부 파일이 누락되는 문제

**설명**:
여러 파일을 업로드할 때 일부 파일이 업로드되지 않으며, 업로드 실패에 대한 에러 메시지가 반환되지 않습니다. 이로 인해 사용자는 다중 파일을 업로드할 때 일부 파일이 누락되는 것을 발견하였고, 고객 문의를 통해 해당 버그를 보고했습니다. 이 문제를 해결하여 업로드 실패 시 명확한 에러 메시지를 JSON 응답 데이터로 제공해야 합니다.

# 2. Postman을 이용한 테스트

### Postman 설정

- Postman을 열고 `http://127.0.0.1:3000/upload` URL로 POST 요청을 설정합니다.

### a유저의 파일 업로드 테스트 (정상 성공 케이스)

1. Body 탭에서 form-data를 선택합니다.
2. key를 `files`로 설정하고, type을 `File`로 설정하여 `image_a` 디렉터리에 있는 2개의 이미지 파일을 업로드합니다.
3. Send 버튼을 클릭하여 요청을 보냅니다.
4. 응답으로 모든 파일이 성공적으로 업로드되었음을 확인합니다.

### b유저의 파일 업로드 테스트 (일부 파일이 누락 케이스)

1. Body 탭에서 form-data를 선택합니다.
2. key를 `files`로 설정하고, type을 `File`로 설정하여 `image_b` 디렉터리에 있는 2개의 이미지 파일을 업로드합니다.
3. Send 버튼을 클릭하여 요청을 보냅니다.
4. 응답으로 일부 파일이 업로드되지 않았고, 명확한 에러 메시지가 반환되지 않았음을 확인합니다.

## 3. 디버깅 마인드셋 템플릿을 활용한 문제 해결

이제 디버깅 마인드셋 템플릿을 활용하여 파일 업로드 검증 로직의 버그를 단계적으로 파악하고 해결해보겠습니다. 각 단계에서 어떤 작업을 수행해야 하는지 가이드를 제공하니, 실제로 문제를 해결하는 과정은 여러분이 직접 수행해보시기 바랍니다.

### Step 1: 문제 정의

현재 풀고자 하는 문제를 한 문장으로 명확하게 정의해보세요.

### Step 2: 올바른 동작 정의

파일 업로드 기능이 올바르게 동작한다면 어떤 일이 벌어져야 하는지 정의해보세요. 이를 명확하게 정의하기 위해 올바른 동작을 given, when, then 형식으로 기술해보세요.

### Step 3: 최소 재현 환경 구축 후 관찰

문제가 발생한 시점을 정확히 확인 후 내 환경에서 직접 재현하기 위해 문제가 있는 부분을 격리시켜보세요. 그리고 재현 환경과 정상 동작의 차이점을 관찰하고, 관찰한 내용을 적어보세요.

### Step 4: 차이를 발생시키는 원인 옵션 도출

Step 3에서 관찰한 차이를 발생시키는 원인이 될 만한 옵션들을 자유롭게 적어보세요. 옵션을 적기 어렵다면 추가 정보를 수집해보세요.

### Step 5: 가설 설정 및 검증

Step 4에서 도출한 옵션 중 하나를 선택하여 검증 가능한 가설을 세워보세요. 그리고 코드에 작은 변경을 가하면서 가설대로 현상이 변하는지 관찰해보세요.

만약 가설이 틀렸다면 그 이유를 적어보고, 다른 가설로 넘어가 반복해보세요.

<details>
<summary>힌트</summary>

- 파일 업로드 시 발생하는 오류를 처리하고, 사용자에게 명확한 에러 메시지를 반환해야 합니다.
- 예를 들어, 파일 크기 제한을 초과한 파일이 있을 때 각 파일의 업로드 상태를 기록하고, 에러 메시지를 포함하여 사용자에게 반환할 수 있습니다.

간단한 에러 처리 예시:

```jsx
app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const uploadedFiles = req.files.map((file) => ({
      fileName: file.originalname,
      filePath: file.path,
      fileSize: file.size,
    }));

    res.json({
      message: "Files uploaded successfully.",
      files: uploadedFiles,
    });
  });
});
```

`err.code`를 출력하여 어떤 에러가 발생했는지 확인하고 이를 처리하는 방법을 생각해보세요.

</details>
