# Backend - Python 개발 환경 설정

## 요구 사항

- Python 3.10 이상
- pip 또는 pipenv

---

## 1. Python 설치 확인

```bash
python --version
# 또는
python3 --version
```

---

## 2. 가상 환경 생성 및 활성화

### pip upgrade

```bash
python.exe -m pip install --upgrade pip
```

### venv 사용 (기본)

```bash
# 가상 환경 생성
python -m venv .venv

# 활성화 (Linux / macOS)
source venv/bin/activate

# 활성화 (Windows)
.venv\Scripts\activate
```

가상 환경이 활성화되면 터미널 프롬프트 앞에 `(venv)` 가 표시됩니다.

---

## 3. 의존성 설치

```bash
pip install fastapi uvicorn requests python-dotenv
```

의존성 목록을 새로 생성하려면:

```bash
pip freeze > requirements.txt
```

---

## 4. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성합니다.

```bash
cp .env.example .env
```

`.env` 파일을 열고 필요한 값을 채웁니다.

```env
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///db.sqlite3
```

> `.env` 파일은 절대 Git에 커밋하지 마세요.

---

## 5. 서버 실행

```bash
python main.py
# 또는 FastAPI / Flask 사용 시
uvicorn app.main:app --reload
```

---

## 6. 가상 환경 비활성화

```bash
deactivate
```

---

## 프로젝트 구조 (예시)

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   └── routes/
├── tests/
├── .env
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

---

## 자주 발생하는 문제

| 문제 | 해결 방법 |
|------|-----------|
| `python` 명령어를 찾을 수 없음 | `python3` 으로 시도하거나 Python을 설치하세요 |
| 패키지 설치 권한 오류 | 가상 환경이 활성화되어 있는지 확인하세요 |
| 모듈을 찾을 수 없음 | `pip install -r requirements.txt` 를 다시 실행하세요 |