# 아키텍처 구조

```
src
├── controller: API 엔드 포인트 및 비즈니스 로직(MySQL 제외)
├── loader: MySQL, Firebase 연결
├── service: MySQL 비즈니스 로직
├── util
│   ├── api.js: 외부 API 연동(OKEX) 함수
│   └── bcrypt.js: 비밀번호 해시 함수
└── index.js: API 서버 엔트리 포인트
```

# 역할 및 프로세스
Server 주소: http://localhost:3001

## 신규유저 가입
### HTTP Request
`POST /api/auth/register`

#### Parameters
|Parameters   |Type   |Required   |Description   |
|---|---|---|---|
|email   |String   |Yes   |로그인에 사용할 이메일 주소   |
|password   |String   |Yes   |로그인에 사용할 비밀번호   |

#### Example
``` json
{
    "email":"kjw4@kjw.com",
    "password":"123456"
}
```

1. email, password를 firebase에 저장 및 uid를 return. (firebase 모듈 createUserWithEmailAndPassword 함수)
    1. 이미 등록된 계정, email 혹은 password를 입력하지 않을 경우 에러 메시지 응답.
3. uid, email, password를 DB에 저장함. (authService)
    1. password는 DB에 저장하기 전에 암호화함. (bcrypt 모듈 hash 함수) 

### Response
```json
"등록 성공"
```

## 로그인
### HTTP Request

`POST /api/auth/login`

#### Parameters
|Parameters|Type|Required|Description|
|---|---|---|---|
|email|String|Yes|로그인에 사용할 이메일 주소|
|password|String|Yes|로그인에 사용할 비밀번호|

#### Example
```json
{
    "email":"kjw4@kjw.com",
    "password":"123456"
}
```

1. email, password를 firebase에 저장된 정보와 일치 여부 확인. (firebase 모듈 signInWithEmailAndPassword 함수)
    1. 일치할 경우 uid return.
    2. 일치하지 않을 경우 에러 메시지 응답. 
3. random token을 생성. (crypto 모듈 randomBytes 함수)
4. DB에서 uid, email 정보가 일치하는 row의 password을 받아옴. (authService)
5. 해당 password를 request body의 password와 비교. (bcrypt 모듈 compare 함수)
    1. 일치할 경우 token값을 DB에 저장 및 Client에 응답. (authService)
    2. 일치하지 않을 경우 에러 메시지 응답.

### Response
#### Parameters
|Parameters   |Type   |   Description   |
|---|---|---|
|token   |String   |API 호출시 사용할 token 정보|

#### Example
``` json
{
    "token": "token"
}
```

## 주문
### HTTP Request

`POST /api/order`

#### Parameters
|Parameters|Type|Required|Description|
|---|---|---|---|
|token|String|Yes|API 접근을 위한 token 정보|
|instrument_id|String|Yes|주문할 instrument id|
|size|Integer|Yes|주문 수량|
|price|Integer|Yes|주문 가격|
|type1|String|Yes|주문 방식 설정 (long, short)|
|type2|String|Yes|지정가, 시장가 설정 (pendingOrder, marketOrder)|

#### Example
``` json
{
    "token": "token",
    "instrument_id": "BTC-USDT-220325",
    "size": 10,
    "price": 62000,
    "type1": "long",
    "type2": "pendingOrder"
}
```
1. token 값을 DB에 요청하여 일치하는지 확인. (authService.check)
    1. 일치할 경우 user_id를 return.
    2. 일치하지 않을 경우 에러 메시지 응답.
3. Orderbook API 호출/
    1. instrument_id를 API 호출 함수의 argument로 받음.
    1. API로 부터 instrument_id에 대한 asks, bids return.
5. type2 값 확인.
    1. 지정가(pendingOrder): 아래의 조건으로 필터링함. (array.filter) 
        1. asks: price <= ask.price
        2. bids: price >= bid.price
    2. 시장가(marketOrder): 필터링 없음.
8. type1 값 확인: 조건에 맞는 주문(함수 argument 결정)을 체결. (doOrder 함수)
    1. long: asks 값을 argument로 받음
    2. short: bids 값을 argument로 받음
11. 체결 결과를 user_id와 함께 DB에 저장.
12. 체결 결과를 Client에 응답.

### Response
#### Parameters
|Parameters   |Type   |   Description   |
|---|---|---|
|order_price   |Integer   |주문 가격|
|order_size   |Integer   |주문 수량|
|exec_price   |String   |체결 가격|
|exec_order   |Integer   |체결 수량|
|timestamp   |String   |체결 시간|

#### Example
```json
[
    {
        "order_price": 60000,
        "order_size": 10,
        "exec_price": "62279.2",
        "exec_order": 2,
        "timestamp": "2021-10-28T06:56:24.330Z"
    },
    {
        "order_price": 60000,
        "order_size": 10,
        "exec_price": "62280.9",
        "exec_order": 1,
        "timestamp": "2021-10-28T06:56:24.330Z"
    },
    {
        "order_price": 60000,
        "order_size": 10,
        "exec_price": "62281.3",
        "exec_order": 1,
        "timestamp": "2021-10-28T06:56:24.330Z"
    },
    ...
]
```

## 체결 목록
### HTTP Request

`POST /api/fetch`

### Parameters
|Parameters|Type|Required|Description|
|---|---|---|---|
|token|String|Yes|API 접근을 위한 token 정보|
|instrument_id|String|Yes|주문할 instrument id|

### Example
```json
{
    "token": "token",
    "base_time":"2021-10-28 00:25:00"
}
```

1. token 값은 DB 요청하여 일치하는지 확인. (authService.check)
    1. 일치할 경우 user_id를 return.
    1. 일치하지 않을 경우 에러 메시지 응답. 
2. user_id와 base_time값을 query를 실행. (fetchService.get)
    1. 값이 없을 경우 에러 메시지 응답. (query 값의 length를 통해 확인)
4. Ticker API를 호출하여 값을 받음.
5. 체결 결과값에서 순이익 값을 계산함.
    1. 체결 결과값의 반복문 사용. (array.forEach)
    1. Ticker API의 instrument_id와 체결 결과값이 일치하는 값을 찾음. (array.find)
6. 결과 값을 Client에 응답.

### Reposne

#### Parameters
|Parameters   |Type   |   Description   |
|---|---|---|
|instrument_id   |String   |체결 id|
|exec_price   |String   |체결 가격|
|exec_size   |Integer   |체결 수량|
|compare   |Integer   |체결 가격과 조회 시점 가격의 금액 차이|
|long   |Integer   |long 주문 평가 손익|
|short   |Integer   |short 주문 평가 손익|

#### Example
```json
[
    {
        "result": {
            "instrument_id": "BTC-USDT-220325",
            "exec_price": "61868.6",
            "exec_size": 1
        },
        "profit": {
            "compare": 223,
            "long": -223,
            "short": 223
        }
    },
    {
        "result": {
            "instrument_id": "BTC-USDT-220325",
            "exec_price": "61868.7",
            "exec_size": 1
        },
        "profit": {
            "compare": 223.09999999999854,
            "long": -223.09999999999854,
            "short": 223.09999999999854
        }
    },
    {
        "result": {
            "instrument_id": "BTC-USDT-220325",
            "exec_price": "61872.3",
            "exec_size": 1
        },
        "profit": {
            "compare": 226.70000000000437,
            "long": -226.70000000000437,
            "short": 226.70000000000437
        }
    },
    ...
 ]
```