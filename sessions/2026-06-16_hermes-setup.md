# 2026-06-16 — Hermes 에이전트 구조 초기화

**완료한 작업**: Hermes 폐쇄형 학습 루프 패턴을 Cowork 환경에 적용한 폴더 구조 구성

**새로 배운 것**: 
- Hermes의 핵심 루프: solve → document → retrieve → improve → repeat
- MEMORY.md (환경/교훈) + USER.md (유저 프로필) 이중 메모리 구조
- Curator 패턴: 주간 스킬/메모리 품질 관리 (점수화, 병합, 가지치기)
- 스킬 = 경험에서 추출한 절차적 메모리, 재사용 단위

**생성된 구조**:
```
cowork/
├── SOUL.md          # 에이전트 페르소나 & 학습 루프 원칙
├── AGENTS.md        # 세션 시작/종료 루틴, 행동 규칙
├── memory/
│   ├── MEMORY.md    # 환경 사실, 교훈, 컨벤션
│   └── USER.md      # kevin 프로필 & 선호도
├── skills/          # 절차적 메모리 (경험 → 스킬)
│   ├── README.md
│   ├── file-ops/
│   ├── research/
│   └── writing/
├── sessions/        # 세션 로그 & 크로스세션 검색
│   └── README.md
├── projects/        # 프로젝트별 컨텍스트
│   └── README.md
└── curator/         # 스킬/메모리 품질 관리
    └── CURATOR.md
```

**다음 세션 이어서 할 것**: 실제 작업 후 첫 스킬 파일 생성
