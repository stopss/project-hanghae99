# WHO ARE YOU

### E반 1조

> 범인은 이 안에 있어!!

WHORU 프로젝트는 <크라임씬> 프로그램을 벤치마킹 해서 만든 온라인 롤플레잉 추리게임입니다.
한 저택에서 "장세민"은 살해당했고, 범인은 과연 누구일까?!

[WHORU 바로가기!](https://whoru.name)

---

## ✅ 작업 기간 및 팀원 소개 ✅

### 🕰 2022-06-24 ~ 2022-8-05

### <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black"/>

- 노희준(부리더)

### <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white"/>

- 진정우(리더)
- 정지은

---

## Service Architecture

![architecture](./images/service-architecture.png)

### 🎬 주요 핵심 기능

- 로그인
- 회원가입
- 소켓
  - 실시간 채팅
  - 실시간 힌트 공유
  - 실시간 방 만들기
  - 실시간 대기방 유저 목록

## Tech Stack

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white) ![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white) ![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white) ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens) ![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white) ![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white) ![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)

## 개발 도구 및 협업 도구

![Trello](https://img.shields.io/badge/Trello-%23026AA7.svg?style=for-the-badge&logo=Trello&logoColor=white) ![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white) ![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white) ![Notion](https://img.shields.io/badge/Notion-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white) ![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white) ![KakaoTalk](https://img.shields.io/badge/kakaotalk-ffcd00.svg?style=for-the-badge&logo=kakaotalk&logoColor=000000)

## 개발 환경

![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white) ![macOS](https://img.shields.io/badge/mac%20os-000000?style=for-the-badge&logo=macos&logoColor=F0F0F0) ![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)

## Commit Convention

```
feat: 새로운 기능 추가
fix: 이미 있는 코드를 수정했을 때나 버그를 수정했을 때
refactor: 코드 리팩토링(하나의 페이지 혹은 하나의 기능을 싹 갈아엎었을때)
test: 테스트 코드
chore: 패키지 매니저 수정이나 세미콜론 추가, 주석 제거(개발에 영향이 가지 않는 코드를 수정을 했을 때)
```

## Trouble Shooting

![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)

<details>
<summary>도입 이유</summary>
<div markdown="1">

무중단 배포를 위한 로드 밸런서
HTTPS, SSL

</div>
</details>

<details>
<summary>에러 및 어려웠던 이유</summary>
<div markdown="1">

Nginx를 처음 공부하는 거였기 때문에 개념이 잘 잡혀져 있지 않았다.
개념이 잘 잡혀져 있지 않은 상태에서 구축을 하려고 하니까 어디서 왜 에러가 생기는지도 잘 몰랐기 때문에 어떤 식으로 해결해야 하는지 감이 오지 않았다

</div>
</details>

<details>
<summary>해결 방법</summary>
<div markdown="1">

구글링을 통해서 Nginx 관련 default 파일을 수정
수정으로도 해결이 되지 않아서 처음부터 다시 구축(을 하면서 동시에 구조가 어떻게 되는지 파악)
구조를 어떻게 만들어지는지 파악하면서 구축을 하기 때문에 같은 에러가 났을 때 왜 에러가 나는지 원인 파악이 가능했다

</div>
</details>
