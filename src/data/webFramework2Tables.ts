export interface ExamTable {
  title: string;
  columns: string[];
  rows: string[][];
}

export const webFramework2ExamTables: ExamTable[] = [
  {
    title: "Auto Configuration 동작 순서",
    columns: ["순서", "단계", "시험 포인트"],
    rows: [
      ["1", "Starter 의존성 추가", "pom.xml에 starter를 추가하면 관련 jar가 classpath에 들어간다."],
      ["2", "classpath 스캔", "Boot가 어떤 라이브러리가 있는지 확인한다."],
      ["3", "@Conditional 조건 평가", "클래스 존재, Bean 부재, 프로퍼티 값 존재 여부를 본다."],
      ["4", "Bean 자동 등록", "조건을 만족하고 개발자 Bean이 없을 때만 등록한다."],
      ["5", "properties 오버라이드", "application.properties로 기본값을 조정한다."],
    ],
  },
  {
    title: "Spring Boot 핵심 기능 비교",
    columns: ["기능", "무엇을 해결하나", "핵심 키워드"],
    rows: [
      ["Auto Configuration", "반복되는 스프링 설정을 조건부로 자동 구성", "classpath, @Conditional, Bean"],
      ["Starters", "의존성 버전 충돌과 라이브러리 조합 문제 해결", "starter, BOM, 버전 생략"],
      ["내장 서버", "별도 WAS 설치 없이 jar 하나로 실행", "Tomcat, Jetty, fat jar"],
      ["Actuator", "운영 중인 앱 상태 확인과 관리", "health, loggers, exposure"],
    ],
  },
  {
    title: "Actuator 노출 설정",
    columns: ["설정", "의미", "주의점"],
    rows: [
      ["기본값", "health만 웹으로 노출", "가장 기본적인 앱 상태 확인"],
      ["include=*", "모든 엔드포인트 노출", "운영 환경에서는 보안 위험을 고려해야 한다."],
      ["exclude=env,shutdown", "env와 shutdown만 제외", "민감 정보와 위험 기능은 빼는 방식으로 관리한다."],
      ["loggers", "로그 레벨 확인/변경", "변경은 보통 POST 방식으로 수행한다."],
    ],
  },
  {
    title: "프로젝트 구조와 패키징",
    columns: ["항목", "역할", "시험 포인트"],
    rows: [
      ["src/main/java", "MVC 등 Java 코드 위치", "ComponentScan 대상 패키지 구조와 함께 이해한다."],
      ["application.properties", "속성 설정", "자동 설정 값을 오버라이드한다."],
      ["static", "이미지, CSS 등 정적 파일", "정적 리소스 위치"],
      ["templates", "Thymeleaf 템플릿", "서버 사이드 템플릿 위치"],
      ["src/main/webapp", "전통적 웹 리소스 위치", "jar 패키징 시 무시될 수 있어 주의한다."],
      ["spring-boot-maven-plugin", "fat jar 리패키징", "실행 가능한 jar를 만든다."],
    ],
  },
];
