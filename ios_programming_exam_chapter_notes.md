# iOS 프로그래밍 시험 대비 PPT 기반 챕터별 핵심 정리

> 기준: 업로드된 주차별 PPT 전체를 바탕으로 정리함. 시험 범위는 **CH09 이후 진도**가 중심이지만, 교수님이 “앞 내용을 배제할 수 없다”고 했으므로 CH01~CH07은 **CH09 이후 내용을 이해하는 선행 개념**으로 묶었다.
>
> 중요도 표기: `★★★` 서술형/단답형 가능성 높음 · `★★` 객관식/단답형 가능성 높음 · `★` 앞 챕터 기반 개념

---

## 0. 전체 시험 흐름 요약

```text
Swift 기본 문법
  ↓
UIView / UIViewController / Delegate / AutoLayout
  ↓
Thread / WebService / JSON
  ↓
UITableView / UICollectionView
  ↓
Master-Detail + NavigationController + UIImagePickerController
  ↓
Firebase Firestore + Storage
  ↓
SwiftUI View / @State / @Binding / List / NavigationLink
  ↓
SwiftUI + Firebase 통합
```

### 예상 출제 비중

| 영역 | 예상 비중 | 이유 |
|---|---:|---|
| CH09 TableView / CollectionView | 높음 | CH09 이후 첫 핵심 진도, DataSource/Delegate/Cell 재사용이 단답·서술 모두 가능 |
| CH10 Master-Detail | 높음 | NavigationController, prepare, 데이터 전달, 카메라, NotificationCenter가 연결됨 |
| CH11 Firebase | 매우 높음 | Firestore/Storage/실시간 동기화/문제 해결 흐름이 서술형에 좋음 |
| CH12 SwiftUI Views | 중간~높음 | UIKit과 SwiftUI 비교, View Protocol, some View, ForEach, TabView |
| CH13 SwiftUI Interaction | 매우 높음 | @State, @Binding, List, NavigationLink, SwiftUI Master-Detail |
| CH14 SwiftUI Firebase | 매우 높음 | 최종 진도. SwiftUI와 Firebase 통합, 이미지 비동기 처리, 삭제/수정 흐름 |
| CH01~CH07 | 중간 | Optional, Delegate, AutoLayout, Thread는 뒤 챕터 문제의 기반 |

---

# PART A. 앞 챕터 핵심 기반 정리

## CH01. iOS 앱 개발 환경 / MVC `★`

### 1) 개발 환경

- iOS 앱 개발은 기본적으로 **macOS + Xcode** 환경에서 진행한다.
- 프로젝트 생성 시 수업 초반부에서는 **Storyboard 방식**을 사용했고, SwiftUI 챕터에서는 SwiftUI 템플릿을 사용한다.
- Xcode 주요 영역:
  - `Navigator`: 프로젝트 파일, 디버깅 정보, 버전 컨트롤 등
  - `Editor`: 소스 코드와 스토리보드 편집
  - `Inspector`: 선택한 객체의 속성 확인/수정
  - `Output/Debugger`: 실행 출력, 브레이크포인트, 변수 확인
  - `Document Outline`: 스토리보드의 뷰 계층 확인

### 2) MVC 패턴

| 구성 | 역할 | 시험 포인트 |
|---|---|---|
| Model | 데이터 저장, 현실 세계의 사물을 표현 | UI를 알지 못함 |
| View | 사용자에게 보이는 객체 | UILabel, UIButton, UITextField 등 |
| Controller | View와 Model을 연결하고 동기화 | 사용자 입력 처리, 화면 구성 |

**핵심 문장**

> MVC에서 Model과 View는 직접 통신하지 않고, Controller가 중간에서 연결한다.

### 3) IBOutlet / IBAction

- `IBOutlet`: 스토리보드의 View 객체를 코드에서 접근하기 위한 연결.
- `IBAction`: 버튼 클릭 등 사용자 이벤트를 코드 함수와 연결.
- 시험에서는 “스토리보드의 View와 UIViewController를 연결하는 방법” 또는 “MVC에서 Controller의 역할”로 나올 수 있음.

---

## CH02. Swift / Swift+ `★~★★`

### 1) let / var

```swift
let a = 10   // 상수, 변경 불가
var b = 20   // 변수, 변경 가능
```

### 2) 타입 추론과 형변환

```swift
let n = 70          // Int로 추론
let d = 70.5        // Double로 추론
let label = "width"
let width = 94
let result = label + String(width)
```

- Swift는 기본적으로 좌우 타입이 맞아야 한다.
- 형변환은 `String(width)`, `Int("10")`, `Double(...)`처럼 생성자 호출 방식으로 한다.

### 3) 배열과 딕셔너리

```swift
var list1: [Int] = []
var list2 = [Int]()

var dict1: [String: Int] = [:]
var dict2 = [String: Int]()
```

- 배열: 순서가 있는 값 모음.
- 딕셔너리: `key-value` 구조.
- Firebase Firestore는 Swift의 딕셔너리 `[String: Any]`와 연결해서 이해해야 한다.

### 4) 함수와 매개변수

- Swift 함수는 외부 매개변수명과 내부 매개변수명을 구분할 수 있다.
- 여러 값을 반환할 때 튜플을 사용할 수 있다.

```swift
func add(_ a: Int, _ b: Int) -> Int {
    return a + b
}
```

### 5) Closure `★★`

- 클로저는 코드 블록을 값처럼 전달하는 기능.
- URLSession의 completion handler, Firebase의 completion, SwiftUI Button action에서 계속 등장한다.
- `@escaping`은 함수가 끝난 뒤에도 클로저가 나중에 실행될 수 있음을 의미한다.

```swift
func work(completion: @escaping () -> Void) {
    DispatchQueue.global().asyncAfter(deadline: .now() + 3) {
        completion()
    }
}
```

### 6) Optional `★★★`

```swift
var a: Int = 10     // 일반 변수, nil 불가
var b: Int? = 20    // Optional, 값 또는 nil 가능
var c: Int!         // Implicitly Unwrapped Optional
```

- `Int("10")`의 결과는 `Int?`이다.
- `Int("10.0")`은 정수 변환 실패로 `nil`이 될 수 있다.
- `!` 강제 언래핑은 값이 nil이면 런타임 에러.
- 안전한 방식은 Optional Binding.

```swift
if let value = Int("10") {
    print(value)
}
```

### 7) Optional Chaining

```swift
person.address?.city
```

- 중간에 nil이 있으면 전체 결과가 nil.
- 앱이 죽지 않고 안전하게 접근 가능.

### 8) Type Casting

```swift
let vc = segue.destination as? CityDetailViewController
let cell = tableView.dequeueReusableCell(withIdentifier: "cell") as! UITableViewCell
```

| 문법 | 의미 |
|---|---|
| `as` | 업캐스팅 등 확실한 변환 |
| `as?` | 실패 가능, Optional 반환 |
| `as!` | 강제 변환, 실패 시 앱 종료 |

### 9) Error Handling

```swift
func f() throws { }

do {
    try f()
} catch {
    print(error)
}
```

---

## CH03. View Hierarchy / UIViewController / Delegate `★~★★`

### 1) View 계층 구조

```text
UIWindow
 └── UIViewController
      └── UIView
           ├── UILabel
           ├── UITextField
           └── UIButton
```

- 모든 앱은 하나의 `UIWindow`를 가진다.
- View는 `UIView` 또는 `UIView` 하위 클래스의 인스턴스.
- View는 자신을 그리는 방법을 알고 있고, 터치 이벤트도 처리할 수 있다.

### 2) UIViewController와 View

- `UIViewController`는 화면 하나를 관리한다.
- Controller는 View를 구성하고, View의 값과 Model 데이터를 연결한다.

### 3) ViewController Life Cycle

```text
loadView()
viewDidLoad()
viewWillAppear()
viewDidAppear()
viewWillDisappear()
viewDidDisappear()
```

| 함수 | 의미 |
|---|---|
| `loadView()` | View 생성 단계 |
| `viewDidLoad()` | View가 메모리에 올라온 뒤 1회 호출, 초기 설정에 적합 |
| `viewWillAppear()` | 화면이 보이기 직전 |
| `viewDidAppear()` | 화면이 보인 직후 |
| `viewWillDisappear()` | 화면이 사라지기 직전 |
| `viewDidDisappear()` | 화면이 사라진 직후 |

### 4) UIResponder / First Responder / 키보드

- `First Responder`는 현재 입력 이벤트를 받는 객체.
- 키보드를 숨길 때는 보통 다음을 사용한다.

```swift
view.endEditing(true)
```

### 5) Delegation

- 어떤 객체가 직접 처리하지 않고, 다른 객체에게 처리를 위임하는 구조.
- 뒤 챕터에서 계속 등장한다.

| 예시 | 역할 |
|---|---|
| `UITextFieldDelegate` | 텍스트 입력 처리 |
| `UITableViewDataSource` | TableView 데이터 공급 |
| `UITableViewDelegate` | TableView 사용자 이벤트 처리 |
| `UIImagePickerControllerDelegate` | 이미지 선택/촬영 결과 처리 |
| `UIPickerViewDataSource`, `UIPickerViewDelegate` | Picker 데이터와 선택 처리 |

---

## CH04. AutoLayout `★★`

### 1) AutoLayout 개념

- 다양한 화면 크기에서 View의 위치와 크기를 계산하는 시스템.
- 하나의 View에 대해 `x`, `y`, `width`, `height`를 계산할 수 있으면 만족 가능한 레이아웃이다.

### 2) Autoresizing과 AutoLayout

| 구분 | 의미 |
|---|---|
| Autoresizing | 초기 iOS 방식, 화면 크기에 따라 여백/크기 비율 조정 |
| AutoLayout | Constraint 기반의 현대적 레이아웃 방식 |

### 3) Safe Area

- 상태바, 노치, 홈 인디케이터, 탭바 등에 가려지지 않는 안전 영역.
- Apple은 Safe Area 밖에 중요한 View를 배치하지 말 것을 권장.

### 4) Constraint

- View의 위치와 크기를 결정하는 제약 조건.
- 예: leading, trailing, top, bottom, width, height 등.

### 5) Content Hugging Priority `★★★`

> “나는 늘어나기 싫다”의 우선순위.

- 값이 높을수록 자신의 intrinsic content size보다 커지지 않으려 한다.
- 여러 View 중 남는 공간을 누가 차지할지 결정할 때 중요.

### 6) Compression Resistance Priority `★★★`

> “나는 줄어들기 싫다”의 우선순위.

- 값이 높을수록 압축되지 않으려 한다.
- 공간이 부족할 때 어떤 View가 먼저 줄어들지 결정한다.

### 7) StackView

- AutoLayout을 쉽게 구성하기 위한 컨테이너.
- `axis`, `spacing`, `distribution`, `alignment` 등이 중요.

---

## CH05. Programming Layout `★★`

### 1) LayoutGuide와 Anchor 10개

| 종류 | Anchor |
|---|---|
| 위치 | `topAnchor`, `bottomAnchor`, `leadingAnchor`, `trailingAnchor`, `leftAnchor`, `rightAnchor`, `centerXAnchor`, `centerYAnchor` |
| 크기 | `widthAnchor`, `heightAnchor` |

### 2) 프로그래밍 AutoLayout 필수 규칙

```swift
someView.translatesAutoresizingMaskIntoConstraints = false
```

- 프로그래밍으로 만든 View는 기본적으로 autoresizing이 켜져 있으므로 반드시 꺼야 한다.
- Constraint를 적용하려는 View와 기준 View는 같은 View 계층 안에 있어야 한다.

### 3) Constraint 생성과 활성화

```swift
let c = label.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 100)
c.isActive = true
```

또는

```swift
NSLayoutConstraint.activate([
    label.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 100),
    label.topAnchor.constraint(equalTo: view.topAnchor, constant: 100),
    label.widthAnchor.constraint(equalToConstant: 200),
    label.heightAnchor.constraint(equalToConstant: 30)
])
```

### 4) 프로그래밍으로 Hugging / Compression Resistance 설정

```swift
label.setContentHuggingPriority(.defaultHigh, for: .horizontal)
label.setContentCompressionResistancePriority(.required, for: .horizontal)
```

### 5) 프로그래밍 UIStackView

```swift
let stack = UIStackView(arrangedSubviews: [label, button])
stack.axis = .vertical
stack.spacing = 10
```

### 6) 프로그래밍 Action

```swift
button.addTarget(self, action: #selector(buttonTapped), for: .touchUpInside)
```

- `#selector`는 Objective-C 런타임과 연결되는 함수 지정.
- 연결되는 함수는 보통 `@objc` 필요.

---

## CH06. Multiple ViewController / TabBar / Navigation `★★`

### 1) Application 구조

```text
UIWindow
 └── rootViewController
      └── ViewController.view
```

- `SceneDelegate`에서 `window`와 `rootViewController`를 확인할 수 있다.

### 2) UITabBarController

- 여러 ViewController를 탭으로 전환한다.
- 내부적으로 `viewControllers` 배열을 가진다.
- 현재 선택된 화면은 `selectedViewController` 또는 `selectedIndex`로 관리된다.

```text
UITabBarController
 ├── CityViewController
 └── MapViewController
```

### 3) UITabBarItem

- 탭바에 표시되는 이름과 아이콘.
- 각 ViewController마다 탭바 아이템을 설정할 수 있다.

### 4) UIPickerView

필요 프로토콜:

```swift
UIPickerViewDataSource
UIPickerViewDelegate
```

중요 함수:

```swift
func numberOfComponents(in pickerView: UIPickerView) -> Int
func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int
func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String?
```

### 5) MapView / Geocoding

- 도시 이름을 위도·경도로 변환할 때 `CLGeocoder` 사용.
- 지도에 주석을 달 때 annotation 사용.

### 6) Segue / present / NavigationController

| 방식 | 의미 |
|---|---|
| Segue | Storyboard 기반 화면 전환 |
| `performSegue` | 코드로 Segue 실행 |
| `prepare(for:sender:)` | 전환 전 destination ViewController에 데이터 전달 |
| `present` | Segue가 아닌 방식으로 ViewController 표시 |
| NavigationController | push/pop stack 구조 |

```swift
performSegue(withIdentifier: "GotoDetail", sender: indexPath)
```

---

## CH07. Thread & Web Services `★★★`

### 1) Thread / Queue 개념

- Swift에서는 여러 작업을 `Queue`에 넣고 실행한다.
- `DispatchQueue`는 GCD에서 관리한다.

| 개념 | 의미 |
|---|---|
| Sync | 서브 작업이 끝날 때까지 기다림 |
| Async | 서브 작업이 끝날 때까지 기다리지 않음 |
| Serial | 작업을 순서대로 하나씩 실행 |
| Concurrent | 여러 작업을 동시에 실행 가능 |

### 2) Main Queue `★★★`

- GUI와 사용자 인터랙션을 담당하는 Queue.
- Thread 번호 1.
- 기본적으로 Serial.
- UI 업데이트는 반드시 Main Thread에서 해야 한다.

```swift
DispatchQueue.main.async {
    self.label.text = "완료"
}
```

**시험 핵심 문장**

> URLSession이나 Firebase completion handler는 서브 스레드에서 실행될 수 있으므로, UILabel/UIImageView 같은 UIKit UI 변경은 Main Thread에서 해야 한다.

### 3) Global Queue

```swift
DispatchQueue.global(qos: .userInteractive)
DispatchQueue.global(qos: .userInitiated)
DispatchQueue.global(qos: .utility)
```

- `userInteractive`: 높은 우선순위.
- `userInitiated`: 사용자가 시작한 작업.
- `utility`: 낮은 우선순위의 오래 걸리는 작업.
- `DispatchQueue.global(qos: .userInteractive)`와 `DispatchQueue.main`은 같지 않다.

### 4) asyncAfter

```swift
DispatchQueue.global().asyncAfter(deadline: .now() + 3) {
    print("3초 뒤 실행")
}
```

### 5) REST API / Web Service

- REST API는 HTTP 요청으로 데이터를 읽고/생성/수정/삭제하는 API.
- GET, POST, PUT, DELETE가 대표적.

| 방식 | 의미 | 예시 |
|---|---|---|
| GET | 데이터 조회 | 날씨 데이터 가져오기 |
| POST | 데이터 전송 | 요청 body에 JSON 전송 |

### 6) URLSession 관련 클래스

| 클래스 | 역할 |
|---|---|
| `URLSession` | 네트워크 세션 관리 |
| `URLRequest` | 요청 URL, HTTP Method, Header, Body 설정 |
| `URLSessionTask` | 실제 요청 작업 |
| `Completion Handler` | 요청 완료 후 실행되는 클로저 |

`URLSession` 종류:

- Default Session: 기본, 디스크 기반 캐싱 지원.
- Ephemeral Session: 데이터 저장하지 않는 시크릿 세션.
- Background Session: 앱 종료 후에도 통신 지원.

`URLSessionTask` 종류:

- Data Task
- Download Task
- Upload Task
- Stream Task

### 7) URLRequest 핵심 속성

```swift
var request = URLRequest(url: url)
request.httpMethod = "POST"
request.addValue("application/json", forHTTPHeaderField: "Content-Type")
request.httpBody = try! JSONSerialization.data(withJSONObject: data)
```

### 8) JSON 분석

```swift
let jsonObject = try! JSONSerialization.jsonObject(with: jsonData) as! [String: Any]
let main = jsonObject["main"] as! [String: Any]
let temp = main["temp"] as! Double
```

- JSON 객체는 Swift에서 Dictionary/Array로 변환해서 접근한다.
- `as!`를 많이 쓰면 데이터 구조가 다를 때 앱이 죽을 수 있다.

### 9) SVProgressHUD

- 오래 걸리는 작업 시작/종료를 사용자에게 보여주는 라이브러리.
- Swift Package Manager 또는 CocoaPods로 설치 가능.
- CocoaPods로 설치하면 `.xcworkspace`로 열어야 한다.

---

# PART B. CH09 이후 시험 핵심 정리

## CH09. TableView & CollectionView `★★★`

### 1) 학습목표

- TableView의 필요성 이해.
- DataSource와 Delegate 구현.
- `UITableViewCell` 이해.
- TableView row 삽입/삭제/이동.
- TableView와 CollectionView의 공통점과 차이.
- TableView 코드를 CollectionView로 변형.

---

### 2) UITableView 기본 용어

| 용어 | 의미 |
|---|---|
| `UITableView` | 여러 데이터를 행 단위로 보여주는 View |
| `UITableViewCell` | TableView의 각 행 |
| section | 행을 묶는 단위 |
| accessory | cell 오른쪽에 표시되는 부가 UI |

---

### 3) Static Cells vs Dynamic Prototypes

| 구분 | Static Cells | Dynamic Prototypes |
|---|---|---|
| 데이터 입력 | Interface Builder에서 직접 입력 | 런타임에 DataSource가 제공 |
| 런타임 변경 | 불가 | 가능 |
| 주 사용 | 고정 메뉴 | 대부분의 앱 리스트 |
| 사용자 상호작용 | 제한적 | Delegate로 처리 |

**핵심**

> Dynamic Prototype은 Interface Builder에서 데이터를 제공할 수 없으므로 반드시 DataSource가 데이터를 제공해야 한다.

---

### 4) DataSource `★★★`

DataSource는 TableView에 **데이터를 공급**한다.

필수에 가까운 함수:

```swift
func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int

func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell
```

선택 함수:

```swift
func numberOfSections(in tableView: UITableView) -> Int
```

예시:

```swift
extension TableViewController: UITableViewDataSource {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return cities.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = UITableViewCell()
        cell.textLabel?.text = cities[indexPath.row].name
        return cell
    }
}
```

등록:

```swift
cityTableView.dataSource = self
```

---

### 5) Delegate `★★★`

Delegate는 TableView에서 발생하는 **사용자 이벤트**를 처리한다.

대표 함수:

```swift
func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
    descriptionLabel.text = cities[indexPath.row].description
}
```

등록:

```swift
cityTableView.delegate = self
```

### DataSource와 Delegate 차이

| 구분 | DataSource | Delegate |
|---|---|---|
| 역할 | 데이터를 몇 개 보여줄지, 어떤 Cell을 보여줄지 제공 | 선택, 높이, 편집 등 이벤트와 표시 방식 처리 |
| 대표 함수 | `numberOfRowsInSection`, `cellForRowAt` | `didSelectRowAt`, `heightForRowAt`, `commit editingStyle` |
| 시험 키워드 | 데이터 공급자 | 대리자 / 이벤트 처리 |

---

### 6) IndexPath

- `indexPath.section`: 섹션 번호.
- `indexPath.row`: TableView 행 번호.
- CollectionView에서는 보통 `indexPath.item`도 사용한다.

---

### 7) UITableViewCell 구조

```text
UITableViewCell
 ├── contentView
 ├── accessoryView
 └── accessoryType
```

- 직접 View를 넣을 때는 `cell.contentView.addSubview(...)` 사용.
- `accessoryType`은 iOS가 제공하는 오른쪽 부가 아이콘.
- `accessoryView`는 개발자가 직접 만든 View.

---

### 8) City 데이터 적용 흐름

1. `numberOfRowsInSection`에서 `cities.count` 반환.
2. `cellForRowAt`에서 해당 도시 이름, 국가, 이미지 표시.
3. `didSelectRowAt`에서 선택된 도시 description을 Label에 출력.
4. 처음 실행 시 0번째 row를 선택하고 description을 초기화.

```swift
cityTableView.selectRow(
    at: IndexPath(row: 0, section: 0),
    animated: true,
    scrollPosition: .top
)
descriptionLabel.text = cities[0].description
```

---

### 9) Cell 재사용 `★★★`

```swift
cityTableView.register(UITableViewCell.self, forCellReuseIdentifier: "jmlee")

let cell = tableView.dequeueReusableCell(withIdentifier: "jmlee") as! UITableViewCell
```

- `dequeueReusableCell`은 식별자로 cell을 pool에 저장하고 재사용한다.
- 매번 새 cell을 만들지 않아 성능이 좋아진다.

#### 재사용 시 주의점

재사용 cell에 `addSubview`를 반복하면 이전 View가 계속 누적된다.

해결:

```swift
for view in cell.contentView.subviews {
    view.removeFromSuperview()
}
```

**시험 핵심 문장**

> Cell 재사용 시 이전 contentView의 subview가 남아 있을 수 있으므로, 동적으로 subview를 추가했다면 재사용 전에 제거해야 한다.

---

### 10) 준비된 UITableViewCell 스타일

- `default`
- `value1`
- `value2`
- `subtitle`

`subtitle` 스타일은 `textLabel`, `detailTextLabel`, `imageView` 등을 자동 제공한다.

제한:

- 값 제공은 쉽지만, 내부 View의 자유로운 추가/재배치가 제한된다.
- 이미지 크기나 text alignment가 원하는 대로 반영되지 않을 수 있다.

---

### 11) Cell 높이 조절

```swift
func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
    return (indexPath.row % 3 == 0) ? 100 : 50
}
```

---

### 12) Accessory / Editing Control

| 속성 | 의미 |
|---|---|
| `accessoryType` | iOS 기본 accessory 사용 |
| `accessoryView` | 개발자 정의 UIView 사용 |
| `isEditing` | 편집 모드 여부 |

대표 accessory:

- Disclosure Indicator
- Detail Disclosure
- Checkmark
- Detail

---

### 13) Row 삭제와 이동 `★★★`

편집 모드:

```swift
cityTableView.isEditing = true
```

Edit/Done 토글:

```swift
@IBAction func editingTableViewRow(_ sender: UIBarButtonItem) {
    if cityTableView.isEditing {
        sender.title = "Edit"
        cityTableView.isEditing = false
    } else {
        sender.title = "Done"
        cityTableView.isEditing = true
    }
}
```

삭제:

```swift
func tableView(_ tableView: UITableView,
               commit editingStyle: UITableViewCell.EditingStyle,
               forRowAt indexPath: IndexPath) {
    if editingStyle == .delete {
        cities.remove(at: indexPath.row)
        tableView.reloadData()
    }
}
```

이동:

```swift
func tableView(_ tableView: UITableView,
               moveRowAt sourceIndexPath: IndexPath,
               to destinationIndexPath: IndexPath) {
    let city = cities.remove(at: sourceIndexPath.row)
    cities.insert(city, at: destinationIndexPath.row)
    tableView.reloadData()
}
```

**핵심**

> TableView의 row 이동/삭제 화면 처리는 TableView가 해주지만, 실제 데이터 배열도 반드시 같이 수정해야 한다.

---

### 14) UICollectionView 개념

`UICollectionView`는 그리드, 스택, 타일, 원형 배열 등 유연한 배치를 제공한다.

구성 요소:

| 요소 | 의미 |
|---|---|
| Cell | 주요 콘텐츠 표시 |
| Supplementary View | 섹션 정보, header/footer 등 |
| Decoration View | 배경 장식 등 |
| Layout Object | item의 크기, 위치, 시각적 스타일 결정 |

---

### 15) TableView와 CollectionView 차이 `★★★`

| 구분 | TableView | CollectionView |
|---|---|---|
| 기본 형태 | 세로 리스트 | 자유로운 그리드/타일 |
| Cell | `UITableViewCell` | `UICollectionViewCell` |
| Scroll 방향 | 기본적으로 수직 | 수직/수평 가능 |
| 기본 Cell 스타일 | default, subtitle 등 존재 | 기본 스타일 거의 없음 |
| DataSource/Delegate | 필요 | 필요 |
| 섹션 | 있음 | 있음 |
| 레이아웃 객체 | 상대적으로 단순 | `UICollectionViewLayout`, `UICollectionViewFlowLayout` 중요 |

---

### 16) CollectionView DataSource

```swift
extension CollectionViewController: UICollectionViewDataSource {
    func collectionView(_ collectionView: UICollectionView,
                        numberOfItemsInSection section: Int) -> Int {
        return actresses.count
    }

    func collectionView(_ collectionView: UICollectionView,
                        cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "jmlee", for: indexPath)
        return cell
    }
}
```

등록:

```swift
actressCollectionView.dataSource = self
actressCollectionView.register(UICollectionViewCell.self, forCellWithReuseIdentifier: "jmlee")
```

---

### 17) CollectionView Delegate / FlowLayout

```swift
extension CollectionViewController: UICollectionViewDelegate, UICollectionViewDelegateFlowLayout {
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        descriptionLabel.text = actresses[indexPath.row].description
    }

    func collectionView(_ collectionView: UICollectionView,
                        layout collectionViewLayout: UICollectionViewLayout,
                        sizeForItemAt indexPath: IndexPath) -> CGSize {
        return (indexPath.row % 3 == 0)
            ? CGSize(width: 250, height: 200)
            : CGSize(width: 200, height: 250)
    }
}
```

**중요**

> Cell 크기를 delegate 함수로 정하려면 `UICollectionViewDelegateFlowLayout`도 만족해야 한다.

---

### 18) CH09 서술형 대비 답안 뼈대

**문제 예시: TableView에서 DataSource와 Delegate의 역할을 설명하고, Cell 재사용 시 주의점을 설명하시오.**

답안 뼈대:

1. TableView는 여러 데이터를 행 단위로 보여주는 View이다.
2. DataSource는 행 개수와 Cell을 제공한다.
3. Delegate는 선택, 높이, 삭제/이동 같은 이벤트와 표시 방식을 처리한다.
4. Cell은 성능을 위해 `dequeueReusableCell`로 재사용한다.
5. 재사용 cell에 subview를 계속 추가하면 중첩되므로, 재사용 전에 기존 subview를 제거해야 한다.
6. 화면의 row 삭제/이동뿐 아니라 실제 데이터 배열도 수정해야 한다.

---

## CH10. Master-Detail `★★★`

### 1) 학습목표

- `UIImagePickerController`로 카메라/앨범 이미지 가져오기.
- 동적 AutoLayout 이해.
- `NotificationCenter` 이해.
- Master-Detail 구조 이해.
- Master-Detail을 위한 `UINavigationController` 활용.

---

### 2) Master-Detail 개념

| 구분 | 의미 | 수업 예시 |
|---|---|---|
| Master | 전체 목록 화면 | 도시 TableView 목록 |
| Detail | 선택 항목의 상세/수정 화면 | 도시 이미지, 이름, 국가, 설명 수정 |

**핵심**

> Master에서 목록을 보여주고, 사용자가 항목을 선택하면 Detail 화면으로 이동하여 세부 정보를 확인/수정한다.

---

### 3) UIImagePickerController `★★★`

`UIImagePickerController`는 사진 촬영 또는 앨범 선택을 담당하는 `UIViewController` 하위 객체이다.

흐름:

```text
UIImageView 탭
  ↓
UITapGestureRecognizer 실행
  ↓
UIImagePickerController 생성
  ↓
sourceType 설정(camera 또는 savedPhotosAlbum)
  ↓
present(...)
  ↓
이미지 선택/촬영 완료
  ↓
delegate 함수 호출
  ↓
UIImageView.image에 반영
  ↓
dismiss(...)
```

탭 제스처:

```swift
let imageTapGesture = UITapGestureRecognizer(target: self, action: #selector(capturePicture))
cityImageView.addGestureRecognizer(imageTapGesture)
```

이미지 선택 화면 표시:

```swift
@objc func capturePicture(sender: UITapGestureRecognizer) {
    let imagePickerController = UIImagePickerController()
    imagePickerController.delegate = self

    if UIImagePickerController.isSourceTypeAvailable(.camera) {
        imagePickerController.sourceType = .camera
    } else {
        imagePickerController.sourceType = .savedPhotosAlbum
    }

    present(imagePickerController, animated: true, completion: nil)
}
```

---

### 4) UIImagePickerController Delegate `★★★`

필요 프로토콜:

```swift
UINavigationControllerDelegate
UIImagePickerControllerDelegate
```

완료 함수:

```swift
func imagePickerController(_ picker: UIImagePickerController,
                           didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
    let image = info[.originalImage] as! UIImage
    cityImageView.image = image
    picker.dismiss(animated: true, completion: nil)
}
```

취소 함수:

```swift
func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
    picker.dismiss(animated: true, completion: nil)
}
```

**단답형 포인트**

- `present`: Segue가 아닌 방식으로 ViewController를 화면에 띄움.
- `dismiss`: 띄운 ViewController를 닫음.
- 시뮬레이터에는 카메라가 없으므로 앨범 사용.
- 실제 카메라 사용 시 Info.plist에 카메라 사용 권한 문구가 필요할 수 있음.

---

### 5) 동적 AutoLayout과 키보드 문제

문제:

> TextField/TextView 입력 시 키보드가 올라와 입력 영역을 가린다.

해결 방법:

1. `editingDidBegin`, `editingDidEnd`로 StackView constraint 조정.
2. 하지만 `UITextView`는 `addTarget` 대상이 아니므로 TextView에는 한계가 있음.
3. 그래서 `NotificationCenter`로 키보드 show/hide를 감지한다.

---

### 6) NotificationCenter `★★★`

종류:

| 종류 | 의미 |
|---|---|
| Notification Center | 앱 내부 또는 시스템이 앱 내부 객체에게 알림 |
| Distributed Notification Center | 폰 내 앱과 앱 사이 알림 |
| Remote Notification Center | 폰과 폰 사이, 서버 필요 |

등록:

```swift
NotificationCenter.default.addObserver(
    forName: UIResponder.keyboardWillShowNotification,
    object: nil,
    queue: OperationQueue.main
) { notification in
    // 키보드가 나타날 때 실행
}
```

해제:

```swift
NotificationCenter.default.removeObserver(
    self,
    name: UIResponder.keyboardWillShowNotification,
    object: nil
)
```

Posting:

```swift
NotificationCenter.default.post(name: NSNotification.Name, object: Any?)
```

키보드 알림은 iOS가 직접 post하므로 개발자가 post하지 않아도 된다.

---

### 7) 키보드 Show/Hide Notification

등록 위치:

- `viewDidAppear()` 권장.

해제 위치:

- `viewDidDisappear()`에서 반드시 해제.

중복 호출 방지:

```swift
var isShowKeyboard = false
```

키보드 show는 두 번 올 수 있음:

1. `inputView`가 나타날 때.
2. `inputAccessoryView`가 나타날 때.

따라서 `isShowKeyboard` 같은 플래그로 중복 이동을 막는다.

---

### 8) UIPickerView 국가 선택

필요 프로토콜:

```swift
UIPickerViewDataSource
UIPickerViewDelegate
```

핵심 함수:

```swift
func numberOfComponents(in pickerView: UIPickerView) -> Int {
    return 1
}

func pickerView(_ pickerView: UIPickerView,
                numberOfRowsInComponent component: Int) -> Int {
    return countries.count
}

func pickerView(_ pickerView: UIPickerView,
                titleForRow row: Int,
                forComponent component: Int) -> String? {
    return countries[row]
}
```

---

### 9) Master에서 Detail로 전이

Segue identifier:

```text
GotoDetail
```

Master에서 row 선택:

```swift
func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
    descriptionTextView.text = cities[indexPath.row].description
    tableView.cellForRow(at: indexPath)?.accessoryType = .detailDisclosureButton
}
```

Accessory 버튼 클릭 시 전이:

```swift
func tableView(_ tableView: UITableView,
               accessoryButtonTappedForRowWith indexPath: IndexPath) {
    tableView.cellForRow(at: indexPath)?.accessoryType = .none
    performSegue(withIdentifier: "GotoDetail", sender: indexPath)
}
```

---

### 10) prepare(for:sender:) `★★★`

`performSegue` 실행 시 destination ViewController가 생성된 뒤 `prepare`가 호출된다.

```swift
override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
    let detailVC = segue.destination as? CityDetailViewController
    detailVC?.cityMasterViewController = self

    if let indexPath = sender as? IndexPath {
        detailVC?.selectedCity = indexPath.row
    }
}
```

**핵심**

- `segue.destination`은 이동할 ViewController.
- `sender`에 `IndexPath`를 넘기면 어떤 row가 선택되었는지 Detail에 전달 가능.
- `prepare` 시점에는 Detail ViewController의 `loadView()`는 아직 실행되지 않았을 수 있음.

---

### 11) 배열/딕셔너리 복사 문제 `★★★`

처음 시도:

```swift
detailVC?.cities = cities
detailVC?.imagePool = imagePool
```

문제:

- Swift의 배열과 딕셔너리는 구조체이다.
- 구조체는 reference가 아니라 값이 복사된다.
- Detail에서 수정해도 Master의 원본 배열/딕셔너리가 바뀌지 않을 수 있다.

해결:

```swift
detailVC?.cityMasterViewController = self
```

즉, Detail에 Master ViewController 자체의 reference를 넘겨서 Master의 `cities`, `imagePool`에 접근하도록 한다.

---

### 12) 수정과 삽입 구분

```swift
var selectedCity: Int?
```

| 상태 | 의미 |
|---|---|
| `selectedCity != nil` | 기존 도시 수정 |
| `selectedCity == nil` | 새로운 도시 삽입 |

저장 흐름:

1. 화면의 값으로 `City` 인스턴스 생성.
2. 수정이면 기존 id/imageName 유지.
3. 삽입이면 새 id와 imageName 생성.
4. imagePool에 이미지 저장.
5. 저장 후 화면 초기화.

---

### 13) Master로 돌아왔을 때 갱신

```swift
override func viewDidAppear(_ animated: Bool) {
    cityTableView.reloadData()

    if let indexPath = cityTableView.indexPathForSelectedRow {
        descriptionLabel.text = cities[indexPath.row].description
    }
}
```

- Back 버튼으로 Master에 돌아왔을 때 TableView를 갱신한다.

---

### 14) 새로운 도시 삽입

Master에 Add 버튼 추가 후:

```swift
@IBAction func addingCity(_ sender: UIBarButtonItem) {
    performSegue(withIdentifier: "GotoDetail", sender: nil)
}
```

- `sender`를 nil로 보내면 Detail에서 `selectedCity`가 없으므로 신규 삽입으로 판단한다.

---

### 15) CH10 서술형 대비 답안 뼈대

**문제 예시: Master-Detail에서 선택된 도시 정보를 Detail로 전달하고 수정 내용을 Master에 반영하는 과정을 설명하시오.**

답안 뼈대:

1. Master는 TableView로 도시 목록을 표시한다.
2. 사용자가 row를 선택하면 accessory를 표시하고, accessory 버튼 클릭 시 `performSegue`로 Detail로 이동한다.
3. `prepare(for:sender:)`에서 destination을 `CityDetailViewController`로 캐스팅하고 선택 row 정보를 전달한다.
4. 배열/딕셔너리는 구조체라 값 복사가 되므로, 단순히 배열을 넘기면 Master 데이터가 갱신되지 않을 수 있다.
5. 따라서 Detail에 Master ViewController reference를 전달하여 원본 `cities`, `imagePool`을 수정한다.
6. Back으로 돌아오면 `viewDidAppear()`에서 `reloadData()`를 호출해 변경 내용을 TableView에 반영한다.

---

## CH11. Firebase `★★★`

### 1) 학습목표

- Firebase 기능과 서비스 이해.
- Firestore 특징 이해 및 적용.
- Firestorage/Storage 특징 이해 및 적용.

---

### 2) Firebase란?

Firebase는 Google에서 제공하는 클라우드 서비스이다.

| 서비스 | 역할 |
|---|---|
| Realtime Database | Firebase의 원래 실시간 DB, 동기화 상태가 중요한 모바일 앱에 사용 |
| Cloud Firestore | 클라우드 NoSQL DB, 글로벌 규모 데이터 저장 및 실시간 동기화, 효율적 쿼리 |
| Cloud Storage | 이미지, 오디오, 동영상 등 사용자 제작 콘텐츠 저장 |
| Authentication | 이메일/비밀번호, Google/Facebook 등 사용자 인증 |
| ML Kit | 모바일 머신러닝 기능 |
| Cloud Functions | 서버 관리 없이 백엔드 코드 실행 |
| Hosting | 웹 앱 호스팅, CDN, SSL |
| Crashlytics | 앱 비정상 종료 보고 |
| Performance Monitoring | 성능 문제 진단 |
| Test Lab | 가상/실제 기기 자동 테스트 |

---

### 3) Firebase 프로젝트 연결

수업 흐름:

1. Firebase Console에서 프로젝트 생성.
2. iOS 앱 등록.
3. `GoogleService-Info.plist` 다운로드.
4. Xcode 프로젝트에 추가.
5. Swift Package Manager로 Firebase iOS SDK 설치.
6. 필요한 라이브러리로 Firestore, Storage 추가.
7. Firestore와 Storage 서비스 활성화.
8. 앱 시작 시 `FirebaseApp.configure()` 호출.

UIKit 프로젝트에서는 보통 `AppDelegate`에서 초기화:

```swift
import Firebase
import FirebaseFirestore
import FirebaseStorage

FirebaseApp.configure()
```

---

### 4) Swift Package Manager와 CocoaPods

| 방식 | 특징 |
|---|---|
| Swift Package Manager | 수업에서 추천. Xcode와 통합되어 종속성 다운로드/컴파일/연결 자동화 |
| CocoaPods | Podfile 작성 후 `pod install`, 이후 `.xcworkspace`로 열어야 함 |

---

### 5) Firestore 구조 `★★★`

Firestore는 NoSQL 데이터베이스이다.

```text
collection
 └── document
      └── field: value
```

Swift에서는 Dictionary 형태로 저장한다.

```swift
Firestore.firestore()
    .collection("test")
    .document("name")
    .setData(["name": "Jae Moon Lee"])
```

---

### 6) Query와 실시간 동기화 `★★★`

쿼리가 설정된 경우:

1. Query 설정.
2. Query를 만족하는 데이터 전체가 `.add` 형태로 앱에 전송됨.
3. 이후 Query를 만족하는 데이터가 add/modify/delete 되면 실시간으로 앱에 전달됨.

```swift
let query = reference
    .whereField("id", isGreaterThanOrEqualTo: 0)
    .whereField("id", isLessThanOrEqualTo: 10000)

existQuery = query.addSnapshotListener(onChangingData)
```

중요:

- Query는 set하는 것이 아니라 add하는 구조이므로 누적될 수 있다.
- 기존 Query가 있으면 `remove()` 해야 한다.

```swift
if let query = existQuery {
    query.remove()
}
```

---

### 7) Database 프로토콜

```swift
enum DbAction {
    case add, detete, modify
}

protocol Database {
    init(parentNotification: (([String: Any]?, DbAction?) -> Void)?)
    func setQuery(from: Any, to: Any)
    func saveChange(key: String, object: [String: Any], action: DbAction)
}
```

주의:

- PPT 코드에는 `delete`가 아니라 `detete`로 작성되어 있다.
- 시험에서는 수업 코드 기준으로 `detete`가 보일 수 있으니 헷갈리지 말기.

---

### 8) DbFirebase 클래스

주요 변수:

```swift
var reference: CollectionReference = Firestore.firestore().collection("cities")
var parentNotification: (([String: Any]?, DbAction?) -> Void)?
var existQuery: ListenerRegistration?
```

의미:

| 변수 | 의미 |
|---|---|
| `reference` | Firestore의 `cities` collection 참조 |
| `parentNotification` | DB 변경이 생겼을 때 부모에게 알려주는 클로저 |
| `existQuery` | 이미 등록된 Query listener |

---

### 9) saveChange()

```swift
func saveChange(key: String, object: [String: Any], action: DbAction) {
    if action == .detete {
        reference.document(key).delete()
        return
    }
    reference.document(key).setData(object)
}
```

- `.detete`면 Firestore document 삭제.
- add/modify는 `setData` 사용.
- `setData`는 key가 있으면 overwrite, 없으면 insert.

---

### 10) onChangingData() `★★★`

Firestore가 원격으로 호출하는 함수.

```swift
func onChangingData(querySnapshot: QuerySnapshot?, error: Error?) {
    guard let querySnapshot = querySnapshot else { return }

    for documentChange in querySnapshot.documentChanges {
        let dict = documentChange.document.data()
        var action: DbAction?

        switch documentChange.type {
        case .added: action = .add
        case .modified: action = .modify
        case .removed: action = .detete
        }

        parentNotification?(dict, action)
    }
}
```

주의:

- 스레드에 의해 실행된다.
- UIKit GUI 변경은 main thread에서 해야 한다.

---

### 11) City ↔ Dictionary 변환

Firebase에 저장하려면 `City` 인스턴스를 Dictionary로 변환해야 한다.

```swift
extension City {
    static func toDict(city: City) -> [String: Any] {
        var dict = [String: Any]()
        dict["id"] = city.id
        dict["name"] = city.name
        dict["country"] = city.country
        dict["description"] = city.description
        dict["imageName"] = city.imageName
        return dict
    }

    static func fromDict(dict: [String: Any]) -> City {
        let id = dict["id"] as! Int
        let name = dict["name"] as! String
        let country = dict["country"] as! String
        let description = dict["description"] as! String
        let imageName = dict["imageName"] as! String
        return City(id: id, name: name, country: country, description: description, imageName: imageName)
    }
}
```

---

### 12) CityMasterViewController와 Firebase

- `CityMasterViewController`가 전체 데이터를 관리한다.
- `cityData.json`에서 읽은 기본 데이터 + Firebase에 저장된 신규 데이터를 함께 관리.

```swift
var dbFirebase: DbFirebase?

dbFirebase = DbFirebase(parentNotification: manageDatabase)
dbFirebase?.setQuery(from: 1, to: 10000)
```

`manageDatabase` 역할:

- `.add`: 배열에 추가.
- `.modify`: 같은 id의 city를 찾아 수정.
- `.detete`: 같은 id의 city를 찾아 삭제.
- 변경 후 TableView reload.

---

### 13) id 기준 로컬 데이터와 Firebase 데이터 구분

수업 코드 기준:

| id 범위 | 의미 |
|---|---|
| `id < 1011` | 기존 `cityData.json`에서 읽은 로컬 데이터 |
| `id >= 1011` | Firebase에 저장해야 하는 데이터 |

수정/삭제 시 id 기준으로 로컬 배열만 바꿀지 Firebase에 반영할지 결정한다.

---

### 14) Storage 구조 `★★★`

Firestore와 다르게 Storage는 파일 단위 저장소이다.

| 구분 | Firestore | Storage |
|---|---|---|
| 저장 대상 | 구조화 데이터, Dictionary, JSON 비슷한 문서 | 파일, 이미지, 오디오, 동영상 |
| 구조 | Collection / Document / Field | Folder / File |
| Query | 가능 | 없음 |
| 수업 예시 | 도시 id, name, country, description, imageName | 도시 이미지 JPEG |

---

### 15) 이미지 업로드/다운로드

업로드:

```swift
func uploadImage(imageName: String, image: UIImage) {
    guard let imageData = image.jpegData(compressionQuality: 1.0) else { return }

    let reference = Storage.storage().reference().child("cities").child(imageName)
    let metaData = StorageMetadata()
    metaData.contentType = "image/jpeg"

    reference.putData(imageData, metadata: metaData, completion: nil)
}
```

다운로드:

```swift
func downloadImage(imageName: String, completion: @escaping (UIImage?) -> Void) {
    let reference = Storage.storage().reference().child("cities").child(imageName)
    let megaByte = Int64(10 * 1024 * 1024)

    reference.getData(maxSize: megaByte) { data, error in
        completion(data != nil ? UIImage(data: data!) : nil)
    }
}
```

**핵심**

- Storage의 `putData`, `getData`는 비동기적으로 실행된다.
- 다운로드 결과는 completion으로 전달한다.

---

### 16) 이미지 읽는 순서

CityDetailViewController와 CityMasterViewController에서 이미지 로딩 순서:

```text
imagePool
  ↓ 없으면
Assets / cityData 이미지
  ↓ 없으면
Firebase Storage 다운로드
```

- 이미지가 다운로드된 뒤 cell layout이 필요하면 `cell.setNeedsLayout()` 사용.
- Main Run Loop의 update cycle에서 layout/display/constraint가 갱신된다.

---

### 17) Firebase 실시간 테스트

- 한 시뮬레이터에서 Firebase 데이터를 삭제하면 앱에서도 즉시 반영.
- 두 개의 시뮬레이터를 실행하면 한쪽에서 삽입/수정/삭제한 내용이 다른 쪽에도 자동 반영.

---

### 18) 문제 1: 이미지 업로드 순서 문제 `★★★`

문제:

```text
A가 도시 수정
  ↓
Firestore에 도시 data 먼저 저장
  ↓
B가 data 변경 알림을 받음
  ↓
B가 Storage에서 이미지 다운로드 요청
  ↓
그런데 A의 이미지 업로드가 아직 완료되지 않음
  ↓
B는 이전 이미지 또는 nil을 받음
```

원인:

- Firestore data 저장과 Storage image 저장이 분리되어 있고, 둘 다 비동기 작업이다.
- data 변경 알림이 image 업로드 완료보다 먼저 도착할 수 있다.

해결:

```text
이미지 먼저 Storage에 업로드
  ↓
업로드 완료 completion 호출
  ↓
그 다음 Firestore에 city data 저장
  ↓
다른 기기가 data 변경 알림을 받았을 때는 이미 이미지가 Storage에 존재
```

수정 코드 핵심:

```swift
func uploadImage(imageName: String, image: UIImage, completion: @escaping () -> Void) {
    guard let imageData = image.jpegData(compressionQuality: 1.0) else { return }

    let reference = Storage.storage().reference().child("cities").child(imageName)
    let metaData = StorageMetadata()
    metaData.contentType = "image/jpeg"

    reference.putData(imageData, metadata: metaData) { data, error in
        completion()
    }
}
```

저장 흐름:

```swift
dbFirebase.uploadImage(imageName: city.imageName, image: image) {
    dbFirebase.saveChange(key: String(id), object: City.toDict(city: city), action: operation)
}
```

---

### 19) 문제 2: 동일 데이터 수정 문제 `★★★`

문제:

- 도시의 text data는 그대로이고 이미지만 바뀐 경우.
- Firestore에 같은 data를 다시 저장해도 Firestore가 “변경 없음”으로 판단할 수 있다.
- 그러면 다른 기기에서 `manageDatabase`가 호출되지 않아 이미지 변경을 모른다.

해결:

- Dictionary 변환 시 현재 시간 정보를 추가한다.
- 매번 저장할 때 `datetime`이 달라지므로 Firestore가 변경으로 인식한다.

```swift
extension City {
    static func toDict(city: City) -> [String: Any] {
        var dict = [String: Any]()
        dict["id"] = city.id
        dict["name"] = city.name
        dict["country"] = city.country
        dict["description"] = city.description
        dict["imageName"] = city.imageName
        dict["datetime"] = Date().timeIntervalSince1970
        return dict
    }
}
```

---

### 20) CH11 서술형 대비 답안 뼈대

**문제 예시: Firestore와 Storage를 함께 사용할 때 이미지가 이전 이미지로 보이는 문제가 발생하는 이유와 해결 방법을 설명하시오.**

답안 뼈대:

1. 도시의 일반 데이터는 Firestore에 저장하고 이미지는 Storage에 저장한다.
2. 두 작업은 비동기적으로 실행된다.
3. Firestore data를 먼저 저장하면 다른 기기에서 data 변경 알림을 받고 곧바로 Storage image를 다운로드하려 한다.
4. 이때 이미지 업로드가 아직 끝나지 않았다면 이전 이미지나 nil이 보인다.
5. 해결은 이미지를 먼저 Storage에 업로드하고, 업로드 completion에서 Firestore data를 저장하는 것이다.
6. 이미지의 내용만 바뀌고 도시 data가 같으면 Firestore가 변경을 감지하지 못할 수 있으므로 `datetime` 필드를 추가하여 매 저장마다 data가 바뀌게 한다.

---

## CH12. SwiftUI Views `★★★`

### 1) SwiftUI 특징

- UI를 직접 조작하는 코드 대신 **원하는 UI 모양을 선언**한다.
- 레이아웃은 SwiftUI 프레임워크가 규칙에 따라 자동 처리한다.
- 동적이고 대화형 UI를 만들 수 있다.
- iOS, macOS, watchOS, tvOS 등 Apple 플랫폼 지원.
- 실시간 Preview 제공.

---

### 2) SwiftUI 프로젝트 구조

#### App 파일

```swift
@main
struct HelloSwiftUIApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

- `@main`: 프로그램 시작점.
- 프로젝트 전체에서 한 번만 사용.
- Storyboard 방식의 AppDelegate/SceneDelegate 역할과 대응.

#### ContentView

```swift
struct ContentView: View {
    var body: some View {
        VStack {
            Image(systemName: "globe")
            Text("Hello, world!")
        }
        .padding()
    }
}
```

#### Preview

```swift
#Preview {
    ContentView()
}
```

- Xcode 15 / iOS 17 이상 방식.
- 예전 방식은 `PreviewProvider` 사용.

---

### 3) View Protocol `★★★`

```swift
protocol View {
    associatedtype Body: View
    var body: Self.Body { get }
}
```

핵심:

- 화면에 보이는 모든 View는 `View` 프로토콜을 만족해야 한다.
- `body`는 저장 프로퍼티가 아니라 **연산 프로퍼티**이다.
- `associatedtype`은 실제 타입이 채택 전까지 정해지지 않는 placeholder.

---

### 4) some View `★★★`

- 실제 반환 View 타입은 `VStack<TupleView<(Text, Text)>>`처럼 매우 복잡할 수 있다.
- `some View`는 복잡한 구체 타입을 숨기기 위해 사용한다.

```swift
var body: some View {
    VStack {
        Text("Hello")
        Text("World")
    }
}
```

---

### 5) 생성자와 수정자

```swift
Text("Hello")
    .font(.largeTitle)
    .foregroundColor(.red)
```

- `Text("Hello")`: 생성자.
- `.font(...)`, `.foregroundColor(...)`: modifier.
- modifier는 새로운 View를 반환하므로 순서가 중요할 수 있다.

예:

```swift
Image("Lenna")
    .resizable()
    .frame(width: 200, height: 200)
```

- `resizable()`은 `Image`를 반환.
- `frame()`은 `View`를 반환.
- 순서가 바뀌면 에러가 날 수 있다.

---

### 6) UIKit과 SwiftUI 대응표 `★★`

| UIKit | SwiftUI |
|---|---|
| UILabel | Text |
| UITextField | TextField |
| UIButton | Button |
| UIImageView | Image |
| UISwitch | Toggle |
| UISlider | Slider |
| UIStepper | Stepper |
| UIPickerView | Picker |
| UISegmentedControl | Picker |
| UIDatePicker | DatePicker |
| UITextView | 직접 대응 없음 |
| UIStackView | HStack, VStack |
| UIScrollView | ScrollView |
| UITableView | List |
| UICollectionView | 직접 대응 없음 |
| UIViewController | View |
| UINavigationController | NavigationView |
| UITabBarController | TabView |
| UISplitViewController | NavigationView |

---

### 7) 기본 View

#### Text

```swift
Text("Hello World")
    .font(.largeTitle)
    .foregroundColor(.red)
    .background(.yellow)
    .lineLimit(3)
    .lineSpacing(50)
```

#### Button

```swift
Button(action: {
    print("tap")
}, label: {
    Text("Button")
})
```

#### Spacer

- 포함된 Stack의 주축 방향으로 확장되는 유연한 공간.

```swift
Spacer(minLength: 250)
```

#### VStack / HStack / ZStack

```swift
VStack(alignment: .center, spacing: 30) {
    Text("A")
    Text("B")
}
```

- `.font()`, `.bold()` 같은 modifier는 자식 View에 상속될 수 있다.

---

### 8) Image 관련 modifier

```swift
Image("Lenna")
    .resizable()
    .scaledToFit()
    .frame(width: 100, height: 200)
```

| Modifier | 의미 |
|---|---|
| `.resizable()` | 이미지 크기 조정 가능 |
| `.scaledToFit()` | 비율 유지, 작은 크기로 맞춤 |
| `.scaledToFill()` | 비율 유지, 큰 크기로 채움 |
| `.aspectRatio(..., contentMode:)` | 비율 조절 |
| `.clipShape(Circle())` | 이미지 모양 변경 |

---

### 9) TextField / SecureField

```swift
@State var value = ""

TextField("value", text: $value)
    .keyboardType(.decimalPad)
```

- TextField의 `text`는 Binding을 받는다.
- 그래서 `@State` 변수 앞에 `$`를 붙인다.

---

### 10) Picker

```swift
@State var selectedCity = 0

Picker("Choose a city", selection: $selectedCity) {
    ForEach(0..<cities.count) { i in
        Text(cities[i].name)
    }
}
.pickerStyle(.wheel)
```

---

### 11) ForEach `★★★`

ForEach는 컬렉션 데이터를 반복하여 View를 만든다.

형태:

```swift
ForEach(0..<arr.count) { i in
    Text("\(arr[i])")
}
```

```swift
ForEach(arr, id: \.self) { value in
    Text("\(value)")
}
```

```swift
struct E: Identifiable {
    let id: Int
    let value: Int
}

ForEach(arr1) { e in
    Text("\(e.value)")
}
```

핵심:

- ForEach는 각 element를 구별할 수 있는 id가 필요하다.
- 데이터가 `Identifiable`이면 id를 자동 사용.
- 그렇지 않으면 `id: \.self` 또는 KeyPath 사용.

---

### 12) Map

```swift
@State private var region = MKCoordinateRegion(
    center: CLLocationCoordinate2D(latitude: 37.5642135, longitude: 127.0016985),
    span: MKCoordinateSpan(latitudeDelta: 0.1, longitudeDelta: 0.1)
)

Map(coordinateRegion: $region)
```

- Map의 region도 Binding을 받는다.

---

### 13) TabView

```swift
TabView {
    CityPickerView()
        .tabItem {
            Image(systemName: "city")
            Text("City")
        }

    CityMapView()
        .tabItem {
            Image(systemName: "map.fill")
            Text("Map")
        }
}
```

- UIKit의 `UITabBarController`와 대응.

---

### 14) SwiftUI WebService

- `.onAppear()`에서 웹서비스 호출.
- `URLSession`으로 GET/POST 요청.
- JSON은 `JSONSerialization`으로 분석.
- 긴 결과는 `ScrollView`에 표시.
- SVProgressHUD를 SwiftPM으로 설치해 로딩 표시 가능.

보안상 PPT에 있는 API key 문자열은 이 정리본에 적지 않음. 시험에서는 키 자체가 아니라 GET/POST 구조, URLRequest, JSON 처리 흐름이 중요하다.

---

### 15) CH12 서술형 대비 답안 뼈대

**문제 예시: SwiftUI의 View Protocol과 some View의 의미를 설명하시오.**

답안 뼈대:

1. SwiftUI에서 화면에 보이는 모든 것은 `View` 프로토콜을 만족한다.
2. View는 `associatedtype Body: View`와 `var body: Self.Body { get }`를 가진다.
3. `body`는 저장 프로퍼티가 아니라 연산 프로퍼티이다.
4. 여러 컨테이너와 modifier를 사용하면 실제 반환 타입이 매우 복잡해진다.
5. `some View`는 이 복잡한 구체 타입을 숨기면서 View를 반환한다는 사실만 드러내는 방식이다.

---

## CH13. SwiftUI Interaction `★★★`

### 1) 학습목표

- 화면 refresh를 위한 `@State` 이해.
- 하위 View로부터 데이터를 받아오는 `@Binding` 이해.
- View Life 이해.
- TabView 구조와 서브뷰 간 데이터 전달.
- List로 Table 만들기.
- NavigationView, NavigationLink로 Master-Detail 개발.

---

### 2) @State `★★★`

```swift
@State var userInput = ""
```

의미:

- View의 상태를 나타내는 변수.
- 값이 변경되면 View의 상태가 변경된 것이므로 화면을 다시 렌더링한다.

예:

```swift
struct StateView: View {
    @State var userInput = ""

    var body: some View {
        VStack {
            Text(userInput)
            TextField("아무거나 입력하시오", text: $userInput)
        }
    }
}
```

---

### 3) `$`와 Binding

```swift
TextField("value", text: $userInput)
```

- `$userInput`은 상태변수를 Binding 형태로 전달한다.
- PPT에서는 C언어의 `&userInput`과 비슷한 개념으로 설명한다.

```text
@State 변수: 실제 값 보관
$변수: 그 값을 수정할 수 있는 Binding 전달
```

---

### 4) TextField 생성자

```swift
init<S>(
    _ title: S,
    text: Binding<String>,
    onEditingChanged: @escaping (Bool) -> Void,
    onCommit: @escaping () -> Void
) where S : StringProtocol
```

핵심:

- TextField의 `text` 매개변수는 `String`이 아니라 `Binding<String>`이다.

---

### 5) @Binding `★★★`

하위 View가 상위 View의 상태를 수정해야 할 때 사용한다.

```swift
struct MyTextField: View {
    @Binding var inputData: String

    var body: some View {
        TextField("", text: $inputData)
    }
}
```

상위 View:

```swift
struct BindingView: View {
    @State var userInput = ""

    var body: some View {
        MyTextField(inputData: $userInput)
    }
}
```

관계:

```text
상위 View: @State var userInput
          ↓ $userInput 전달
하위 View: @Binding var inputData
```

---

### 6) @State vs @Binding 비교 `★★★`

| 구분 | @State | @Binding |
|---|---|---|
| 위치 | 값을 소유하는 View | 값을 빌려 쓰는 하위 View |
| 역할 | 상태 저장, 변경 시 View 재렌더링 | 부모 상태를 직접 읽고 수정 |
| 초기화 | 직접 초기값 필요 | 직접 초기화하지 않음, 부모가 전달 |
| 전달 방식 | `$stateValue` | `@Binding var value` |
| 예시 | `@State var text = ""` | `@Binding var text: String` |

---

### 7) onChange / onAppear / onDisappear

```swift
.onChange(of: selectedCity) { oldValue, newValue in
    cityName = cities[selectedCity].name
}
```

| Modifier | 의미 |
|---|---|
| `.onChange(of:)` | 값 변경 감지 |
| `.onAppear()` | View가 나타날 때 호출 |
| `.onDisappear()` | View가 사라질 때 호출 |

---

### 8) TabView에서 서브뷰 간 데이터 전달

구조:

```text
CityTabView
 ├── @State var selectedCity
 ├── CityPickerView(cityName: $selectedCity)
 ├── CityMapView(cityName: selectedCity)
 └── CityWeatherView(cityName: selectedCity)
```

핵심:

- `CityPickerView`는 도시 선택 값을 부모에게 전달해야 하므로 `@Binding` 사용.
- `CityMapView`, `CityWeatherView`는 값을 받아 사용만 하므로 일반 `var cityName: String` 사용.

---

### 9) Preview에서 Binding 전달

Binding 변수가 있는 View는 Preview에서도 값을 줘야 한다.

```swift
#Preview {
    CityPickerView(cityName: .constant("Sydney"))
}
```

---

### 10) List `★★★`

SwiftUI의 `List`는 UIKit의 `UITableView`와 유사하다.

정적 리스트:

```swift
List {
    Text("Text")
    Circle()
}
```

배열 리스트:

```swift
List(arr, id: \.self) { value in
    Text("\(value)")
}
```

ForEach와 결합:

```swift
List {
    ForEach($cities, id: \.self) { $city in
        CityListViewCell(city: $city)
    }
}
```

---

### 11) NavigationView `★★★`

- UIKit의 `UINavigationController`와 유사.
- 내부에 List를 넣고 title, EditButton, Add button 등을 붙일 수 있다.

```swift
NavigationView {
    List {
        ForEach($cities, id: \.self) { $city in
            CityListViewCell(city: $city)
        }
    }
    .navigationTitle("관광도시")
    .navigationBarItems(leading: EditButton())
}
```

---

### 12) Delete / Add Row

삭제:

```swift
.onDelete { indexSet in
    cities.remove(atOffsets: indexSet)
}
```

Add:

```swift
func addCity() {
    let city = City(id: 1011, name: "Pusan", country: "Korea", description: "test", imageName: "Seoul")
    cities.append(city)
}
```

---

### 13) Extract Subview

- View 코드가 복잡해지면 일부 블록을 하위 View로 분리한다.
- Xcode에서 원하는 블록 선택 후 “Extract Subview” 사용.
- 분리 후 필요한 데이터를 매개변수로 전달해야 한다.

---

### 14) NavigationLink `★★★`

UIKit의 Segue와 유사하게 다른 View로 이동한다.

```swift
NavigationLink(destination: CityDetailView(city: $city)) {
    HStack {
        Text(city.name)
        Text("in \(city.country)")
    }
}
```

---

### 15) SwiftUI Master-Detail 구조

```text
CityMasterView
 └── List
      └── ForEach($cities)
           └── CityListViewCell(city: $city)
                └── NavigationLink
                     └── CityDetailView(city: $city)
```

핵심:

- Master가 `@State var cities`를 소유한다.
- List의 각 row는 `$city` Binding을 하위 View로 전달한다.
- Detail은 `@Binding var city`로 원본 city를 수정한다.

---

### 16) ImagePickerView와 sheet

```swift
@State var image = UIImage()
@State var toggle = false

Image(uiImage: image)
    .onTapGesture {
        toggle.toggle()
    }
    .sheet(isPresented: $toggle) {
        ImagePickerView(sourceType: .photoLibrary) { image in
            self.image = image
        }
    }
```

- `.sheet`는 View 위에 다른 View를 표시한다.
- SwiftUI에서 카메라/앨범 사용을 위해 외부 ImagePickerView 라이브러리 사용.

---

### 17) Detail에서 바로 되돌아가는 문제 `★★★`

문제:

- `TextField("도시를 입력하세요", text: $city.name)`처럼 Detail에서 부모의 Binding 값을 즉시 수정하면, 부모 List가 갱신되면서 Navigation 상태가 바뀌어 Master로 돌아갈 수 있다.

해결:

- 입력 중에는 별도의 `@State` 변수에 저장.
- “수정” 버튼을 눌렀을 때만 `city`에 반영.

```swift
@State var name = ""

TextField("도시를 입력하세요", text: $name)

Button("수정") {
    city.name = name
}
.onAppear {
    name = city.name
}
```

---

### 18) 새로운 City 데이터 추가

`CityNewView`는 부모의 배열을 수정해야 하므로 Binding으로 받는다.

```swift
struct CityNewView: View {
    @Binding var cities: [City]
}
```

신규 저장 흐름:

1. 도시 이름, 국가, 설명, 이미지 입력.
2. id 생성.
3. imageName 생성.
4. `cities.append(city)`.
5. `ImagePool.putImage(...)`.
6. 입력 화면 초기화.

---

### 19) CH13 서술형 대비 답안 뼈대

**문제 예시: SwiftUI에서 @State와 @Binding의 차이를 설명하고, Master-Detail에서 어떻게 사용되는지 설명하시오.**

답안 뼈대:

1. `@State`는 View가 소유하는 상태 변수이고 값이 변경되면 View를 다시 렌더링한다.
2. `@Binding`은 상위 View의 상태를 하위 View가 읽고 수정할 수 있게 연결하는 변수이다.
3. 부모는 `@State var cities`를 가지고, 하위 View에 `$cities` 또는 `$city` 형태로 전달한다.
4. 하위 Detail View는 `@Binding var city`로 전달받아 수정할 수 있다.
5. 단, TextField에 Binding을 직접 연결하면 입력 즉시 부모 List가 갱신되어 Navigation 문제가 생길 수 있으므로, 별도의 `@State` 변수에 임시 저장하고 버튼 클릭 시 반영한다.

---

## CH14. SwiftUI Firebase `★★★`

### 1) 학습목표

- Firebase 사용 복습.
- SwiftUI에서 Firebase 사용 이해.
- SwiftUI와 Storyboard에서 Firebase 사용 차이 이해.

---

### 2) Firebase 앱 추가

- 기존 Firebase 프로젝트에 새 iOS 앱을 추가할 수 있다.
- Bundle Identifier가 변경되면 Firebase에서는 다른 앱으로 여긴다.
- 새 `GoogleService-Info.plist`를 받아야 한다.
- 같은 Firebase 프로젝트의 Firestore/Storage 데이터는 접근 가능하다.

---

### 3) SwiftUI에서 Firebase 초기화 `★★★`

Storyboard/UIKit에서는 보통 `AppDelegate`에서 `FirebaseApp.configure()`를 호출했다.

SwiftUI에서는 `App` 구조체의 `init()`에서 호출한다.

```swift
@main
struct MasterDetailFirebaseApp: App {
    init() {
        FirebaseApp.configure()
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

---

### 4) 준비 파일

CH11에서 복사:

- `Database`
- `DbFirebase`

CH13에서 복사:

- `City.swift`
- `cityData.json`
- `ModelData.swift`
- `CityMasterView.swift`
- `CityDetailView.swift`
- `CityNewView.swift`

Assets:

- `cityImages`

---

### 5) DbFirebase static upload/download `★★★`

CH14에서는 이미지 업로드/다운로드 함수를 static으로 수정한다.

```swift
static func uploadImage(imageName: String, image: UIImage?, completion: @escaping (() -> Void))
```

특징:

- `image == nil`이면 Storage에서 해당 이미지 삭제.
- 이미지가 있으면 JPEG로 변환 후 Storage에 업로드.
- 업로드 완료 시 completion 호출.

다운로드:

```swift
static func downloadImage(imageName: String, completion: @escaping (UIImage?) -> Void)
```

---

### 6) ImagePool 수정 `★★★`

이미지 읽는 순서:

```text
ImagePool 메모리 캐시
  ↓ 없으면
Assets 이미지
  ↓ 없으면
Firebase Storage downloadImage
  ↓ 없으면
빈 UIImage
```

비동기 다운로드이므로 completion이 필요하다.

```swift
ImagePool.image(name: city.imageName, size: size) { image in
    self.image = image
}
```

---

### 7) CityMasterView가 DbFirebase 관리

SwiftUI에서 보통 메인 View가 Firebase 객체를 생성/관리한다.

```swift
@State var dbFirebase: DbFirebase?
```

- 하위 View에 전달해야 하므로 `@State`로 선언.
- `onAppear`에서 한 번만 생성.

```swift
.onAppear {
    if dbFirebase == nil {
        dbFirebase = DbFirebase(parentNotification: manageDatabase)
        dbFirebase?.setQuery(from: 1, to: 10000)
    }
}
```

---

### 8) manageDatabase() `★★★`

Firebase 변경이 생기면 호출된다.

역할:

1. `dict`를 `City`로 변환.
2. Storage를 사용하는 경우 이미지 캐시 제거.
3. `.add`: `cities.append(city)`.
4. `.modify`: 같은 id를 찾아 `cities[i] = city`.
5. `.detete`: 같은 id를 찾아 `cities.remove(at: i)`.

```swift
ImagePool.removeImage(name: city.imageName)
```

- 이미지를 강제로 다시 읽게 하기 위해 캐시를 제거한다.

---

### 9) 새 도시 추가 흐름 `★★★`

`CityNewView`는 Firebase 객체와 도시 배열을 Binding으로 받는다.

```swift
@Binding var dbFirebase: DbFirebase?
@Binding var cities: [City]
```

저장 흐름:

```text
신규 도시 입력
  ↓
City 객체 생성
  ↓
ImagePool에 이미지 저장
  ↓
Storage에 이미지 먼저 업로드
  ↓
업로드 완료 completion
  ↓
Firestore에 도시 data 저장
  ↓
Firebase listener가 manageDatabase 호출
  ↓
CityMasterView의 cities 업데이트
```

핵심 코드:

```swift
DbFirebase.uploadImage(imageName: city.imageName, image: image) {
    dbFirebase?.saveChange(
        key: String(city.id),
        object: City.toDict(city: city),
        action: .add
    )
}
```

---

### 10) dbFirebase Binding 전달 구조

```text
CityMasterView
 ├── @State var dbFirebase
 ├── CityNewView(dbFirebase: $dbFirebase, cities: $cities)
 └── CityListViewCell(dbFirebase: $dbFirebase, city: $city)
      └── CityDetailView(dbFirebase: $dbFirebase, city: $city)
```

- `CityMasterView`가 Firebase 객체를 소유한다.
- 하위 View는 Firebase 객체를 직접 생성하지 않고 Binding으로 전달받는다.

---

### 11) 도시 정보 수정 흐름 `★★★`

`CityDetailView`는 다음을 Binding/State로 가진다.

```swift
@Binding var dbFirebase: DbFirebase?
@Binding var city: City
@State var country = 0
@State var image = UIImage()
@State var name = ""
@State var description = ""
```

왜 `name`, `description`을 별도 `@State`로 두는가?

- 입력 즉시 `city`를 바꾸면 Master List가 갱신되면서 Navigation 문제가 발생할 수 있기 때문이다.
- 버튼 클릭 시에만 `city`에 반영한다.

수정 흐름:

```text
Detail에서 수정 버튼 클릭
  ↓
ImagePool에 이미지 저장
  ↓
id >= 1011이면 Firebase 대상
  ↓
Storage에 이미지 먼저 업로드
  ↓
Firestore에 city data modify 저장
```

```swift
DbFirebase.uploadImage(imageName: city.imageName, image: image) {
    dbFirebase?.saveChange(
        key: String(city.id),
        object: City.toDict(city: city),
        action: .modify
    )
}
```

---

### 12) 문제점 1: 이미지만 변경된 경우 `★★★`

문제:

- 이미지만 바뀌고 City text data가 그대로이면 Firestore가 변경을 감지하지 않을 수 있다.
- 그러면 `manageDatabase`가 호출되지 않는다.

해결:

```swift
dict["datetime"] = Date().timeIntervalSince1970
```

- 저장할 때마다 값이 달라지므로 Firestore가 변경으로 인식한다.

---

### 13) 문제점 2: Firestore/Storage 이미지 비동기 로딩

문제:

```swift
Image(uiImage: ImagePool.image(name: city.imageName).resized(to: size))
```

- 기존 `ImagePool.image`가 메모리나 Assets에서만 이미지를 가져오면 Firebase Storage 이미지를 가져오지 못한다.
- Storage 다운로드는 비동기이므로 즉시 `UIImage`를 반환하는 방식만으로는 부족하다.

해결:

- `@State var image = UIImage()`를 둔다.
- `.onAppear()`에서 `ImagePool.image(...completion:)` 호출.
- completion에서 `self.image` 변경.
- `@State` 값이 바뀌면 View가 다시 그려진다.

```swift
@State var image = UIImage()

Image(uiImage: image)
    .onAppear {
        ImagePool.image(name: city.imageName, size: size) {
            self.image = $0
        }
    }
```

---

### 14) 도시 삭제 `★★★`

삭제 흐름:

| id | 처리 |
|---|---|
| `id < 1011` | 로컬 배열에서 즉시 삭제 |
| `id >= 1011` | Firebase에 `.detete` 저장 요청 |

```swift
func deleteCity(dbFirebase: DbFirebase?, index: Int?) {
    guard let index = index else { return }
    let city = cities[index]

    if city.id < 1011 {
        cities.remove(at: index)
        return
    }

    dbFirebase?.saveChange(
        key: String(city.id),
        object: City.toDict(city: city),
        action: .detete
    )
}
```

주의:

> Firebase 데이터는 여기서 직접 `cities.remove`를 하면 안 된다. Firebase 삭제 결과가 listener를 통해 `manageDatabase()`로 돌아오고, 그곳에서 실제 배열 삭제가 일어나야 한다.

---

### 15) 추가 문제

PPT 마지막에서 제시된 추가 문제:

- 키보드 없애기.
- 삽입 시 이미지 영역 문제.
- id 생성 논리 오류.

id 오류 예시:

```text
1011, 1012, 1013 삽입
  ↓
1011 삭제
  ↓
새로운 도시 삽입
  ↓
cities.count 기반이면 id가 1013으로 다시 할당될 수 있음
```

해결 방향:

- 단순히 `cities.count`로 id를 만들지 말고, 현재 존재하는 최대 id를 찾아 `maxId + 1`로 생성해야 한다.

---

### 16) SwiftUI Firebase와 Storyboard Firebase 차이 `★★★`

| 구분 | Storyboard/UIKit Firebase | SwiftUI Firebase |
|---|---|---|
| 초기화 위치 | AppDelegate | `App` 구조체의 `init()` |
| 화면 단위 | UIViewController | View struct |
| 데이터 갱신 | TableView reloadData 등 직접 호출 | `@State` 변경으로 자동 재렌더링 |
| 데이터 전달 | prepare, reference 전달 | `@State`, `@Binding` 전달 |
| 이미지 비동기 처리 | UIImageView에 completion에서 image 설정 | `@State image` 변경으로 View 갱신 |
| 화면 전환 | Segue, NavigationController | NavigationView, NavigationLink |

---

### 17) CH14 서술형 대비 답안 뼈대

**문제 예시: SwiftUI에서 Firebase Storage 이미지를 비동기로 읽어와 List Cell에 표시하는 방법을 설명하시오.**

답안 뼈대:

1. Firebase Storage의 이미지 다운로드는 비동기 작업이므로 즉시 UIImage를 반환하기 어렵다.
2. `ImagePool.image(name:size:completion:)`처럼 completion을 받는 함수로 수정한다.
3. Cell View에는 `@State var image = UIImage()`를 둔다.
4. Cell이 화면에 나타나는 `.onAppear()`에서 ImagePool을 호출한다.
5. completion에서 `self.image`를 변경한다.
6. `@State` 값이 변경되면 SwiftUI가 View를 다시 렌더링하므로 다운로드된 이미지가 표시된다.

---

# PART C. 시험 직전 암기 리스트

## 1. 단답형 핵심 키워드

| 키워드 | 한 줄 암기 |
|---|---|
| MVC | Model과 View는 직접 통신하지 않고 Controller가 연결 |
| Optional | 값이 있거나 nil일 수 있는 타입 |
| Optional Binding | Optional을 안전하게 꺼내는 방법 |
| Delegate | 다른 객체에게 처리를 위임하는 구조 |
| DataSource | TableView/CollectionView에 데이터를 공급 |
| Main Thread | UI 업데이트 담당 Thread |
| Sync | 작업 완료까지 기다림 |
| Async | 작업 완료까지 기다리지 않음 |
| Serial | 하나씩 순서대로 실행 |
| Concurrent | 동시에 실행 가능 |
| Safe Area | 노치/상태바/홈 인디케이터를 피하는 영역 |
| Hugging Priority | 늘어나기 싫은 정도 |
| Compression Resistance | 줄어들기 싫은 정도 |
| translatesAutoresizingMaskIntoConstraints | 코드 AutoLayout 시 false 필요 |
| UITableViewCell 재사용 | 성능을 위해 dequeue 사용 |
| IndexPath.row | TableView 행 번호 |
| IndexPath.item | CollectionView item 번호 |
| NavigationController | push/pop stack 기반 화면 전환 |
| present | Segue 없이 ViewController 표시 |
| prepare | Segue 전 destination에 데이터 전달 |
| UIImagePickerController | 카메라/앨범 이미지 가져오기 |
| NotificationCenter | 알림 등록/해제/수신 시스템 |
| Firestore | NoSQL 실시간 데이터베이스 |
| Storage | 이미지/파일 저장소 |
| addSnapshotListener | Firestore 실시간 변경 감지 |
| setData | Firestore document 저장/덮어쓰기 |
| putData | Storage 파일 업로드 |
| getData | Storage 파일 다운로드 |
| @main | SwiftUI 앱 시작점 |
| View Protocol | SwiftUI View의 기본 프로토콜 |
| some View | 복잡한 View 반환 타입 숨김 |
| @State | View가 소유하는 상태 변수 |
| @Binding | 부모 상태를 하위 View가 수정하도록 연결 |
| List | SwiftUI의 TableView 유사 View |
| NavigationLink | SwiftUI의 화면 이동 링크 |
| .sheet | View 위에 다른 View 표시 |

---

## 2. 객관식 함정 정리

1. `UITableViewDataSource`는 사용자 선택 이벤트를 처리한다. → 틀림. 데이터 공급 역할.
2. `UITableViewDelegate`는 row 선택, 높이, 편집 이벤트를 처리한다. → 맞음.
3. `dequeueReusableCell`을 쓰면 subview 누적 문제가 절대 생기지 않는다. → 틀림. 직접 추가한 subview는 제거 필요.
4. `DispatchQueue.global(qos: .userInteractive)`는 Main Queue와 같다. → 틀림.
5. URLSession completion handler에서 UIKit UI를 바로 바꿔도 항상 안전하다. → 틀림.
6. Firestore는 이미지 파일 저장에 적합하다. → 틀림. 이미지는 Storage가 적합.
7. Storage는 Query가 가능하다. → 틀림. 파일 단위 저장이며 Query 없음.
8. Firestore `setData`는 key가 있으면 overwrite, 없으면 insert. → 맞음.
9. SwiftUI의 `@State` 값이 변경되면 View가 다시 렌더링된다. → 맞음.
10. `@Binding` 변수는 하위 View에서 부모 상태를 수정할 수 있다. → 맞음.
11. SwiftUI에서 `NavigationLink`는 UIKit의 Segue와 유사하다. → 맞음.
12. SwiftUI 앱에서 Firebase 초기화는 `App` 구조체의 `init()`에서 할 수 있다. → 맞음.
13. 이미지만 변경되었을 때 Firestore가 변경 이벤트를 안 줄 수 있어 datetime을 추가한다. → 맞음.
14. Firebase 데이터 삭제 시 local 배열도 삭제 요청 함수에서 항상 직접 삭제해야 한다. → 틀림. Firebase 대상은 listener/manageDatabase에서 삭제해야 중복 처리 방지.

---

## 3. 서술형 예상 문제 6개

### 문제 1. TableView의 DataSource와 Delegate, Cell 재사용을 설명하시오.

핵심 포함:

- DataSource: row 수, cell 제공.
- Delegate: 선택/높이/편집 이벤트 처리.
- Dynamic Prototype은 runtime 데이터 필요.
- Cell 재사용은 `register`와 `dequeueReusableCell` 사용.
- 직접 subview 추가 시 재사용 전에 제거.
- 데이터 배열과 TableView 화면 모두 갱신해야 함.

### 문제 2. Master-Detail에서 Master의 데이터를 Detail에서 수정 후 반영하는 과정을 설명하시오.

핵심 포함:

- Master는 목록, Detail은 상세/수정.
- accessory 버튼 또는 row 선택 후 `performSegue`.
- `prepare(for:sender:)`에서 destination에 선택 정보 전달.
- 배열/딕셔너리는 구조체라 값 복사 문제 발생.
- Master ViewController reference를 넘겨 원본 데이터 수정.
- 돌아오면 `viewDidAppear`에서 `reloadData`.

### 문제 3. Firebase Firestore와 Storage의 차이와 함께 이미지 업로드 순서 문제를 설명하시오.

핵심 포함:

- Firestore는 NoSQL 문서 DB.
- Storage는 이미지/파일 저장소.
- city data는 Firestore, image는 Storage.
- data를 먼저 저장하면 다른 기기가 image 업로드 전에 다운로드할 수 있음.
- image upload completion 이후 Firestore data 저장.
- 동일 data + image only 변경 문제는 datetime 추가로 해결.

### 문제 4. SwiftUI의 @State와 @Binding을 설명하고 Master-Detail에 적용하는 방법을 설명하시오.

핵심 포함:

- @State는 View가 소유하는 상태.
- 변경 시 View 재렌더링.
- @Binding은 부모 상태를 하위 View가 수정할 수 있게 연결.
- Master의 `@State cities`를 Detail에 `$city`로 전달.
- TextField에는 임시 @State를 사용하고 버튼 클릭 시 city에 반영.

### 문제 5. Thread와 WebService에서 Main Thread가 중요한 이유를 설명하시오.

핵심 포함:

- Main Thread는 GUI와 사용자 인터랙션 담당.
- URLSession completion은 sub thread에서 실행될 수 있음.
- UIKit UI 변경은 Main Thread에서 해야 함.
- `DispatchQueue.main.async` 사용.
- GET/POST, URLRequest, URLSessionTask, JSONSerialization 흐름.

### 문제 6. SwiftUI Firebase에서 Storage 이미지를 List Cell에 표시하는 과정을 설명하시오.

핵심 포함:

- SwiftUI는 View struct와 상태 기반 렌더링.
- Firebase 초기화는 `App.init()`.
- MasterView가 `@State dbFirebase`를 소유하고 한 번만 생성.
- ImagePool은 pool → assets → Storage 순서로 이미지 검색.
- Storage 다운로드는 비동기 completion.
- Cell에 `@State image`를 두고 `.onAppear`에서 다운로드 후 state 변경.

---

# PART D. 최종 우선순위

## 반드시 외울 것 TOP 20

1. MVC에서 Model/View/Controller 역할.
2. Optional, Optional Binding, `as?`, `as!`.
3. Delegate 개념.
4. AutoLayout의 Safe Area, Hugging, Compression Resistance.
5. 코드 AutoLayout에서 `translatesAutoresizingMaskIntoConstraints = false`.
6. Main Thread에서 UI 업데이트.
7. Sync/Async, Serial/Concurrent 차이.
8. URLSession, URLRequest, Completion Handler.
9. TableView DataSource 필수 함수.
10. TableView Delegate 대표 함수.
11. Cell 재사용과 subview 제거.
12. TableView와 CollectionView 차이.
13. `UIImagePickerController`와 필요한 delegate 2개.
14. NotificationCenter add/remove observer.
15. Master-Detail에서 `prepare(for:sender:)`.
16. 배열/딕셔너리 구조체 복사 문제와 reference 전달.
17. Firestore와 Storage 차이.
18. Firebase image upload completion 이후 Firestore 저장.
19. SwiftUI의 `@State`와 `@Binding`.
20. SwiftUI Firebase의 비동기 이미지 로딩과 `@State image`.

---

# 부록. PPT 파일별 슬라이드 인덱스

아래는 분석에 사용한 PPT 파일과 슬라이드 제목 인덱스이다. 복습할 때 “어느 PPT의 어느 슬라이드 흐름인지” 찾기 쉽게 넣었다.


## ch01-개발환경 (3).pptx (33 slides)

| Slide | 제목 |
|---:|---|
| 1 | iOS 앱 개발 환경 |
| 2 | 학습목표 |
| 3 | 개발 환경 |
| 4 | 개발환경 |
| 5 | macOS |
| 6 | xcode |
| 7 | xcode 프로젝트 만들기 |
| 8 | xcode 프로젝트 만들기 |
| 9 | xcode 프로젝트 만들기 |
| 10 | xcode |
| 11 | xcode |
| 12 | 모델-뷰-컨트롤러(MVC) |
| 13 | MVC 패턴 |
| 14 | simpleApp 앱 |
| 15 | simpleApp 앱 |
| 16 | View 디자인 |
| 17 | Object Library |
| 18 | simpleApp 앱 디자인 |
| 19 | 간단한 속성 변경 |
| 20 | View와 UIViewController 연결 |
| 21 | View와 UIViewController 연결 |
| 22 | View와 UIViewController 연결 |
| 23 | 연결 확인 |
| 24 | 모델 레이어 만들기 |
| 25 | 프로그래밍 |
| 26 | 프로그래밍 |
| 27 | 실행 그리고 수정 |
| 28 | 앱 아이콘 |
| 29 | 앱 아이콘 |
| 30 | 앱 아이콘 |
| 31 | 론쳐 화면 |
| 32 | 론쳐 화면 |
| 33 | 론쳐 화면 |

## ch02-swift.pptx (61 slides)

| Slide | 제목 |
|---:|---|
| 1 | Swift |
| 2 | 학습목표 |
| 3 | 스위프트 |
| 4 | Swift란 |
| 5 | Swift란 |
| 6 | Playground |
| 7 | Playground |
| 8 | Playground |
| 9 | 변수, 컨테이너 변수 |
| 10 | 상수, 변수 |
| 11 | 변수의 타입지정 |
| 12 | 형변환 |
| 13 | 상수, 변수 |
| 14 | 배열 |
| 15 | 딕셔너리 |
| 16 | 제어문: if, for, while |
| 17 | 흐름제어 |
| 18 | Switch |
| 19 | for |
| 20 | for |
| 21 | while |
| 22 | 함수 |
| 23 | function |
| 24 | 전달 매개변수 |
| 25 | function |
| 26 | function |
| 27 | function |
| 28 | function |
| 29 | 클로저 |
| 30 | closure |
| 31 | 참고 |
| 32 | closure |
| 33 | closure |
| 34 | 글래스, 구조체 |
| 35 | class |
| 36 | class |
| 37 | class |
| 38 | class |
| 39 | Enumerations |
| 40 | Enumerations |
| 41 | struct |
| 42 | protocol |
| 43 | extension |
| 44 | 옵셔널 |
| 45 | Optional |
| 46 | Optional |
| 47 | Optional |
| 48 | Optional |
| 49 | Optional Binding |
| 50 | Optional Binding |
| 51 | Optional Binding |
| 52 | Optional Chaining |
| 53 | Optional Chaining |
| 54 | 타입 캐스팅, 예외처리 |
| 55 | Type Casting |
| 56 | Type Casting |
| 57 | Type Casting |
| 58 | Type Casting |
| 59 | 에러 처리(Error Handling) |
| 60 | 에러 처리(Error Handling) |
| 61 | 에러 처리(Error Handling) |

## ch02-swiftPlus-대면강의.pptx (25 slides)

| Slide | 제목 |
|---:|---|
| 1 | Swift+ |
| 2 | 학습목표 |
| 3 | Optional |
| 4 | Optional |
| 5 | Optional |
| 6 | Optional |
| 7 | Optional |
| 8 | Optional |
| 9 | Optional Chaining |
| 10 | Optional Chaining |
| 11 | Optional Chaining |
| 12 | Optional Chaining |
| 13 | Optional Chaining |
| 14 | Optional Chaining |
| 15 | Optional Chaining |
| 16 | Optional Chaining |
| 17 | Type Casting |
| 18 | Type Casting |
| 19 | Type Casting |
| 20 | Type Casting |
| 21 | 에러 처리(Error Handling) |
| 22 | 에러 처리(Error Handling) |
| 23 | 에러 처리(Error Handling) |
| 24 | labs |
| 25 | labs |

## ch03-viewHierarchy (2).pptx (45 slides)

| Slide | 제목 |
|---:|---|
| 1 | 뷰와 뷰 계층 구조 |
| 2 | 학습목표 |
| 3 | 뷰 기본 지식 |
| 4 | 뷰 계층 구조 |
| 5 | 뷰 인스턴스의 계층 구조 |
| 6 | 뷰 인스턴스의 계층 구조 |
| 7 | 새로운 프로젝트 만들기 |
| 8 | UI Design |
| 9 | UI Design |
| 10 | UI Design |
| 11 | UI Design |
| 12 | UI Design |
| 13 | ViewController 교체 |
| 14 | 새로운 UIViewController |
| 15 | View Hierarchy |
| 16 | View Hierarchy |
| 17 | UIViewController에서 View Access |
| 18 | UIViewController에서 View Access |
| 19 | UIViewController에서 View Access |
| 20 | UIViewController에서 View Access |
| 21 | UIViewController에서 View Access |
| 22 | UIViewController에서 View Access |
| 23 | UIViewController에서 View Access |
| 24 | UIViewController에서 View Access |
| 25 | UIViewController에서 View Access |
| 26 | UIViewController에서 View Access |
| 27 | UIViewController에서 View Access |
| 28 | UIViewController에서 View Access |
| 29 | UIViewController에서 View Access |
| 30 | UIViewController에서 View Access |
| 31 | UIViewController에서 View Access |
| 32 | UIViewController에서 View Access |
| 33 | 코드 완성하기 |
| 34 | 코드 완성하기 |
| 35 | UIView의 이벤트 핸들러 |
| 36 | UIResponder |
| 37 | First Responder |
| 38 | First Responder |
| 39 | 키보드 숨기기 |
| 40 | Delegation |
| 41 | UITextField를 위한 Delegation |
| 42 | 입력 오류 체크를 위한 Delegation |
| 43 | 입력 오류 체크를 위한 Delegation |
| 44 | 입력 오류 체크를 위한 Delegation |
| 45 | 추가학습 |

## ch04-autolayout(6).pptx (47 slides)

| Slide | 제목 |
|---:|---|
| 1 | 오토레이아웃 |
| 2 | 학습목표 |
| 3 | 오토레이아웃 개념 |
| 4 | 오토리사이징 |
| 5 | 오토리사이징 |
| 6 | 오토리사이징 |
| 7 | 오토레이아웃 |
| 8 | 오토레이아웃 개념 |
| 9 | 오토레이아웃 |
| 10 | 오토레이아웃 |
| 11 | 오토레이아웃 |
| 12 | 오토레이아웃 |
| 13 | 오토레이아웃 지원 도구 |
| 14 | Align Tool |
| 15 | Align Tool |
| 16 | Align Tool |
| 17 | 예제 |
| 18 | 예제 |
| 19 | Resolve Auto Layout Issues Tool |
| 20 | 예제 |
| 21 | Add new constraints |
| 22 | Add new constraints |
| 23 | 예제 |
| 24 | 상대적 콘텐츠 크기 제어 |
| 25 | 콘텐츠 크기의 우선 순위 |
| 26 | 콘텐츠 크기의 우선 순위 |
| 27 | 우선순위 적용 방법 |
| 28 | 우선순위 적용 방법 |
| 29 | 허깅 우선순위 예제 |
| 30 | 허깅 우선순위 예제 |
| 31 | 압축저항 우선순위 예제 |
| 32 | 압축저항 우선순위 예제 |
| 33 | 우선순위 무시 |
| 34 | 예제 |
| 35 | 예제 |
| 36 | 예제 |
| 37 | ConversionViewController 개선 |
| 38 | ConversionViewController 개선 |
| 39 | Auto Layout Without Constraints |
| 40 | StackView |
| 41 | StackView |
| 42 | StackView |
| 43 | 예제 |
| 44 | 예제 |
| 45 | 예제 |
| 46 | 예제 |
| 47 | 예제 |

## ch05-programmingView.pptx (48 slides)

| Slide | 제목 |
|---:|---|
| 1 | 프로그래밍 레이아웃 |
| 2 | 학습목표 |
| 3 | 프로그래밍 Constraints |
| 4 | LayoutGuide |
| 5 | LayoutGuide |
| 6 | 프로그래밍 Constraint 적용 |
| 7 | 프로그래밍 Constraint 적용 |
| 8 | 프로그래밍 고정 레이아웃 |
| 9 | 프로그래밍 레이아웃 |
| 10 | 프로그래밍 레이아웃 |
| 11 | 프로그래밍 레이아웃 |
| 12 | 예제 |
| 13 | 예제 |
| 14 | 예제2 |
| 15 | 예제2 |
| 16 | 프로그래밍 Priority |
| 17 | 프로그래밍 허깅, 압축저항 우선순위 |
| 18 | 예제: 두개의 뷰 |
| 19 | 예제 |
| 20 | 예제 |
| 21 | 예제 |
| 22 | 예제 |
| 23 | 프로그래밍 StackView |
| 24 | 프로그래밍 UIStackView |
| 25 | 예제: UIStackView 이용 |
| 26 | 예제: UIStackView 이용 |
| 27 | 예제: UIStackView 이용 |
| 28 | 예제: UIStackView 이용 |
| 29 | 예제: UIStackView 이용 |
| 30 | 예제: UIStackView 이용 |
| 31 | Interface Builder의 Constraint 액세스 |
| 32 | IB에서의 제한조건 Outlet |
| 33 | 예제: 날아가는 새 |
| 34 | 예제: 날아가는 새 |
| 35 | 예제: 날아가는 새 |
| 36 | 예제: 날아가는 새 |
| 37 | 예제: 날아가는 새 |
| 38 | 프로그래밍 Action |
| 39 | 프로그래밍 Action |
| 40 | 프로그래밍 Action |
| 41 | 프로그래밍 Action |
| 42 | UIButton에 Action달기 |
| 43 | UIButton에 Action달기 |
| 44 | UIButton에 Action달기 |
| 45 | UIButton에 Action달기 |
| 46 | 예제: 날아가는 새 제어하기 |
| 47 | 예제: 날아가는 새 제어하기 |
| 48 | 추가학습 |

## ch06-tabbarControllernavigationController(4).pptx (59 slides)

| Slide | 제목 |
|---:|---|
| 1 | Multiple ViewController |
| 2 | 학습목표 |
| 3 | Application 구조 |
| 4 | Application 구조 |
| 5 | ViewController |
| 6 | 프로젝트 생성 |
| 7 | TabbarController |
| 8 | 프로젝트 확장 |
| 9 | 초기 뷰 컨트롤러 설정하기 |
| 10 | UITabBarController |
| 11 | UITabBarController |
| 12 | UITabBarController |
| 13 | UITabBar & UITabBarItem |
| 14 | UITabBarItem |
| 15 | UITabBarItem |
| 16 | UITabBarItem |
| 17 | 프로그래밍 확장 |
| 18 | 프로그래밍 확장 |
| 19 | 데이터 준비 |
| 20 | 데이터 준비 |
| 21 | 데이터 준비 |
| 22 | 데이터 준비 |
| 23 | CityViewController |
| 24 | UIPickerView |
| 25 | PickerView 설정하기 |
| 26 | PickerView 설정하기 |
| 27 | PickerView 설정하기 |
| 28 | 예제: 이미지 PickerView |
| 29 | 예제: 이미지 PickerView |
| 30 | 예제: 이미지 PickerView |
| 31 | CityViewController |
| 32 | MapViewController |
| 33 | MapViewController 요구사항 |
| 34 | CityViewController 액세스 |
| 35 | 도시 -> (위도, 경도)구하기 |
| 36 | 지도 주석 달기 |
| 37 | 선택 도시 지도 나오기 |
| 38 | ViewController 전이 |
| 39 | 세그웨이 |
| 40 | 다양한 세그웨이 |
| 41 | 전이(transition) 과정 |
| 42 | 전이 스타일 |
| 43 | 전이 스타일 |
| 44 | 프로그래밍 |
| 45 | 전이 함수 |
| 46 | 예제: performSegue |
| 47 | 예제: performSegue |
| 48 | 예제: performSegue |
| 49 | 예제 |
| 50 | 예제: present |
| 51 | 예제: present |
| 52 | 예제: present |
| 53 | NavigationController |
| 54 | UINavigationController |
| 55 | NavigationController |
| 56 | 프로그래밍 확장 |
| 57 | 프로그래밍 |
| 58 | 프로그래밍 |
| 59 | 추가 학습 |

## ch07-threadwebService(3).pptx (53 slides)

| Slide | 제목 |
|---:|---|
| 1 | Thread & Web Services |
| 2 | 학습목표 |
| 3 | 준비 |
| 4 | Thread |
| 5 | 스위프트에서 스레드 |
| 6 | 프로세스와 스레드 |
| 7 | 동기/비동기 실행 |
| 8 | 직렬/동시 실행 |
| 9 | 스레드 Queue |
| 10 | Main Queue |
| 11 | Main Queue |
| 12 | Main Queue |
| 13 | Main Queue |
| 14 | Main Queue |
| 15 | Main Queue |
| 16 | Global Queue |
| 17 | Global Queue |
| 18 | Global Queue |
| 19 | Global Queue |
| 20 | Global Queue |
| 21 | Global Queue |
| 22 | Global Queue |
| 23 | asyncAfter |
| 24 | 웹 서비스 |
| 25 | 웹 서비스 |
| 26 | 웹 서비스 |
| 27 | 웹 서비스을 위한 클래스들 |
| 28 | URLRequest |
| 29 | URLSessionTask |
| 30 | Completion Handler & URLResponse |
| 31 | 예제 |
| 32 | Web Service |
| 33 | 프로젝트 확장 |
| 34 | 전역변수등 준비하기 |
| 35 | Get 방식: 날씨 데이터 가져오기 |
| 36 | JSON 데이터 분석 |
| 37 | 날씨 데이터  분석하기 |
| 38 | 날씨 데이터 출력하기 |
| 39 | 날씨 데이터 추출하기 |
| 40 | POST방식: 주요정보 가져오기 |
| 41 | POST방식: 주요정보 가져오기 |
| 42 | cocopods |
| 43 | Cocoapods & ProgressHUD |
| 44 | 라이브러리 사용 2가지 방법 |
| 45 | SwiftPM으로 SVProgressHUD 설치 |
| 46 | SwiftPM으로 SVProgressHUD 설치 |
| 47 | Pod로 SVProgressHUD 설치 |
| 48 | Pod로 SVProgressHUD 설치 |
| 49 | SVProgressHUD 사용 |
| 50 | SVProgressHUD 사용 |
| 51 | Ch06과 ch07합치기 |
| 52 | Ch06과 ch07합치기 |
| 53 | Ch06과 ch07합치기 |

## ch09-tableViewCollectionView(1).pptx (48 slides)

| Slide | 제목 |
|---:|---|
| 1 | TableView & CollectionView |
| 2 | 학습목표 |
| 3 | UITableView |
| 4 | UITableView |
| 5 | UITableView |
| 6 | 프로젝트 |
| 7 | 데이터 준비 |
| 8 | TableView 설정하기 |
| 9 | TableView 설정하기 |
| 10 | TableView 설정하기 |
| 11 | TableView 설정하기 |
| 12 | TableView 설정하기 |
| 13 | 예제: TableView에 City 데이터 |
| 14 | 예제: TableView에 City 데이터 |
| 15 | 예제: TableView에 City 데이터 |
| 16 | 예제: TableView에 City 데이터 |
| 17 | UITableViewCell의 재사용 |
| 18 | UITableViewCell의 재사용 |
| 19 | UITableViewCell의 재사용 |
| 20 | 준비된 UITableViewCell |
| 21 | 준비된 UITableViewCell |
| 22 | 준비된 UITableViewCell |
| 23 | 준비된 UITableViewCell |
| 24 | 준비된 UITableViewCell |
| 25 | Accessory/Editing Control |
| 26 | 테이블 row의 삭제, 이동 |
| 27 | 테이블 row의 삭제, 이동 |
| 28 | 테이블 row의 삭제, 이동 |
| 29 | 테이블 row의 삭제, 이동 |
| 30 | UICollectionView |
| 31 | UICollectionView |
| 32 | UICollectionView |
| 33 | UICollectionView |
| 34 | 프로젝트 변경 |
| 35 | CollectionView 설정하기 |
| 36 | CollectionView 설정하기 |
| 37 | CollectionView 설정하기 |
| 38 | CollectionView 설정하기 |
| 39 | Layout Object |
| 40 | 수직/수평 스크로링 변경 |
| 41 | Cell의 크기 변경 |
| 42 | Cell의 크기 변경 |
| 43 | 예제: CollectionView에 Actress 데이터 |
| 44 | 데이터 준비 |
| 45 | 예제: CollectionView에 Actress 데이터 |
| 46 | 예제: CollectionView에 Actress 데이터 |
| 47 | 예제: CollectionView에 Actress 데이터 |
| 48 | 추가학습 |

## ch10-masterDetail (1)(1).pptx (44 slides)

| Slide | 제목 |
|---:|---|
| 1 | Master - Detail |
| 2 | 학습목표 |
| 3 | Camera |
| 4 | 프로젝트 |
| 5 | Outlet, Action |
| 6 | 사진찍어 가져오기 |
| 7 | 사진찍어 가져오기 |
| 8 | 사진찍어 가져오기 |
| 9 | 사진찍어 가져오기 |
| 10 | 카메라 사용허가 |
| 11 | 사진찍어 가져오기 |
| 12 | 실제 폰 연결 |
| 13 | 실제 폰 연결 |
| 14 | 실제 폰 연결 |
| 15 | 실제 폰 연결 |
| 16 | 동적 오토레이아웃 |
| 17 | 동적 오토레이아웃 |
| 18 | 동적 오토레이아웃 |
| 19 | 동적 오토레이아웃 |
| 20 | NotificationCenter |
| 21 | NotificationCenter |
| 22 | Keyboard Show/Hide Notification |
| 23 | Keyboard Show/Hide Notification |
| 24 | Keyboard Show/Hide Notification |
| 25 | Keyboard Show/Hide Notification |
| 26 | 기타 코딩 |
| 27 | 마스터-디테일 |
| 28 | 마스터 복사 |
| 29 | CityMasterViewController 코드 정리 |
| 30 | CityMasterViewController 코드 정리 |
| 31 | CityDetailViewController로 전이 |
| 32 | CityDetailViewController로 전이 |
| 33 | CityDetailViewController로 전이 |
| 34 | CityDetailViewController 수정 |
| 35 | CityDetailViewController 수정 |
| 36 | CityDetailViewController 수정 |
| 37 | CityMasterViewController 수정 |
| 38 | 문제 해결 |
| 39 | 문제 해결 |
| 40 | 문제 해결 |
| 41 | 문제 해결 |
| 42 | 문제 해결 |
| 43 | 새로운 도시 삽입 |
| 44 | 새로운 도시 삽입 |

## ch11-firebase(1).pptx (50 slides)

| Slide | 제목 |
|---:|---|
| 1 | Firebase |
| 2 | 학습목표 |
| 3 | 준비 |
| 4 | Firebase |
| 5 | Firebase란 |
| 6 | Firebase란 |
| 7 | 지원기능 |
| 8 | Firebase에서 프로젝트 생성 |
| 9 | 앱과 연결 |
| 10 | 앱과 연결 |
| 11 | 필요한 라이브러리 설치 |
| 12 | 필요한 라이브러리 설치 |
| 13 | 필요한 라이브러리 설치 |
| 14 | 필요한 라이브러리 설치 |
| 15 | 필요한 라이브러리 설치 |
| 16 | Firebase 활성화 |
| 17 | Firebase 활성화 |
| 18 | Firebase 활성화 |
| 19 | 연결 테스트 |
| 20 | 연결 테스트 |
| 21 | Firestore 구조 |
| 22 | Firestore 구조 |
| 23 | 데이터베이스 프로토콜 |
| 24 | DbFirebase 클래스 |
| 25 | DbFirebase 구현 |
| 26 | DbFirebase 구현 |
| 27 | DbFirebase 구현 |
| 28 | 데이터 변환 함수 |
| 29 | Firebase에 데이터 저장하기 |
| 30 | Firebase에 데이터 저장하기 |
| 31 | Firebase에 데이터 저장하기 |
| 32 | Firebase에 데이터 저장하기 |
| 33 | CityMasterViewController 보완 |
| 34 | CityMasterViewController 보완 |
| 35 | Storage 구조 |
| 36 | 이미지 저장/읽어오기 |
| 37 | 이미지 저장/읽어오기 |
| 38 | 이미지 저장/읽어오기 |
| 39 | 이미지 저장/읽어오기 |
| 40 | setNeedLayout |
| 41 | setNeedLayout |
| 42 | 테스팅 |
| 43 | 테스팅 |
| 44 | 문제1: image 업로드 문제 |
| 45 | 문제1: image 업로드 문제 |
| 46 | 문제1: image 업로드 문제 |
| 47 | 문제1: image 업로드 문제 |
| 48 | 문제2: 동일 데이터 수정 문제 |
| 49 | 문제2: 동일 데이터 수정 문제 |
| 50 | 문제2: 동일 데이터 수정 문제 |

## ch11-firebase문제및해결방법.pptx (7 slides)

| Slide | 제목 |
|---:|---|
| 1 | 문제1: image 업로드 문제 |
| 2 | 문제1: image 업로드 문제 |
| 3 | 문제1: image 업로드 문제 |
| 4 | 문제1: image 업로드 문제 |
| 5 | 문제2: 동일 데이터 수정 문제 |
| 6 | 문제2: 동일 데이터 수정 문제 |
| 7 | 문제2: 동일 데이터 수정 문제 |

## ch12-swiftUI-views(1).pptx (44 slides)

| Slide | 제목 |
|---:|---|
| 1 | SwiftUI의 기초, 뷰 |
| 2 | 학습목표 |
| 3 | swiftUI 특징 |
| 4 | SwiftUI 프로그래밍 환경 |
| 5 | 둘러보기 |
| 6 | 리소스 파일들 |
| 7 | 리소스 파일들 |
| 8 | View Protocol |
| 9 | View Protocol |
| 10 | Some View |
| 11 | 코드 수정하기 |
| 12 | Object Library 활용 |
| 13 | Object Library 활용 |
| 14 | View 활용하기 |
| 15 | Text, Button |
| 16 | 예제 |
| 17 | 폰트 크기 변경 |
| 18 | padding |
| 19 | Spacer |
| 20 | VStack |
| 21 | 예제: VStack |
| 22 | Image |
| 23 | 예제: 레나 |
| 24 | contentMode |
| 25 | AspectRatio |
| 26 | ClipShape |
| 27 | 예제: 화씨 -> 섭씨 |
| 28 | 예제:  UnionJack 그리기 |
| 29 | 예제: 로그인 화면 |
| 30 | Picker |
| 31 | ForEach |
| 32 | ForEach |
| 33 | 예제: 도시선택 |
| 34 | 예제: 도시선택 |
| 35 | 예제: 도시선택 |
| 36 | 예제: Map |
| 37 | 예제: TabView |
| 38 | 웹서비스 |
| 39 | 웹서비스 |
| 40 | 웹서비스 |
| 41 | 웹서비스 |
| 42 | 웹서비스 |
| 43 | 웹서비스 |
| 44 | 예제: TabView에 통합 |

## ch13-swiftUI-interaction.pptx (47 slides)

| Slide | 제목 |
|---:|---|
| 1 | Interaction |
| 2 | 학습목표 |
| 3 | 상태변수 |
| 4 | 상태변수 |
| 5 | 상태변수 |
| 6 | 예제: QuizView |
| 7 | 바인딩 변수 |
| 8 | 바인딩 변수 |
| 9 | 예제: ConversionView |
| 10 | TabView에서 바인딩 |
| 11 | 준비사항 |
| 12 | CityPickerView 수정 |
| 13 | CityPickerView 수정 |
| 14 | CityPickerView 수정 |
| 15 | CityPickerView 수정 |
| 16 | 예제: TabView에서 데이터 전달 |
| 17 | 예제: TabView에서 데이터 전달 |
| 18 | 예제: TabView에서 데이터 전달 |
| 19 | 예제: TabView에서 데이터 전달 |
| 20 | 예제: TabView에서 데이터 전달 |
| 21 | 예제: TabView에서 데이터 전달 |
| 22 | 예제: TabView에서 데이터 전달 |
| 23 | Master-Detail |
| 24 | List |
| 25 | List |
| 26 | NavigationView |
| 27 | NavigationView |
| 28 | NavigationView |
| 29 | NavigationView |
| 30 | NavigationView |
| 31 | 서브 뷰로 추출 |
| 32 | 서브 뷰로 추출 |
| 33 | 서브 뷰로 추출 |
| 34 | NavigationLink |
| 35 | NavigationLink |
| 36 | CityDetailView |
| 37 | CityDetailView |
| 38 | CityDetailView |
| 39 | Master-Detail |
| 40 | 카메라 사용 |
| 41 | ImagePickerView 라이브러리 |
| 42 | CityDetailView 수정 |
| 43 | CityMasterView |
| 44 | 키 입력시 되돌아 가지 않기 |
| 45 | 새로운 City 데이터 |
| 46 | 새로운 City 데이터 |
| 47 | 전체 통합 |

## ch14-swiftUI-firebase(1).pptx (32 slides)

| Slide | 제목 |
|---:|---|
| 1 | Firebase |
| 2 | 학습목표 |
| 3 | Firebase 앱추가 |
| 4 | Firebase와 연결 |
| 5 | 필요한 라이브러리 설치 |
| 6 | 필요한 라이브러리 설치 |
| 7 | Firebase와 연결 |
| 8 | Firebase와 연결 |
| 9 | 준비하기 |
| 10 | 준비 |
| 11 | 준비 |
| 12 | DbFirebase 객체 생성, 관리 |
| 13 | DbFirebase 객체 생성, 관리 |
| 14 | 새로운 도시 추가 |
| 15 | 새로운 도시 추가 |
| 16 | 새로운 도시 추가 |
| 17 | 새로운 도시 추가 |
| 18 | 도시 정보 수정 |
| 19 | 도시 정보 수정 |
| 20 | 도시 정보 수정 |
| 21 | 도시 정보 수정 |
| 22 | 도시 정보 수정 |
| 23 | 도시 정보 수정 |
| 24 | 도시 정보 수정 |
| 25 | 도시 정보 수정 |
| 26 | 도시 정보 수정 |
| 27 | 도시 정보 수정 |
| 28 | 도시 정보 수정 |
| 29 | 도시 삭제 |
| 30 | 도시 삭제 |
| 31 | 도시 삭제 |
| 32 | 추가 문제 |
