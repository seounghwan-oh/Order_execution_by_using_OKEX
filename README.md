# 프로젝트 목적

암호화폐 거래소 OKEX의 오더북을 이용하여 가상 주문체결을 수행하는 REST API 구축
회원가입, 로그인, 주문, 조회 기능

---

# 참고 데이터

1. Google Firebase : [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Amazon RDS : [https://aws.amazon.com/ko/rds/](https://aws.amazon.com/ko/rds/)
3. OKEX Orderbook : [https://www.okex.com/docs/en/#futures-data](https://www.okex.com/docs/en/#futures-data)
4. OKEX Ticker : [https://www.okex.com/docs/en/#futures-all](https://www.okex.com/docs/en/#futures-all)

---

# 기술 스택

node.js 기반 express 프레임워크를 사용, AWS의 RDS(mysql)에 데이터를 수집 (테이블 2개: 회원등록정보, 주문체결정보),
Google Firebase SDK를 이용하여 회원을 관리

---

# 세부 기능

    1. Google Firebase에 프로젝트를 생성하고, SDK Config 정보를 얻습니다.
    2. AWS RDS(mysql)를 프리티어로 생성하여, 호스트 정보를 얻습니다. 
        - 퍼블릭 접근 허용
    3. API의 기능별 path(router)는 회원가입, 로그인, 주문, 조회 4가지로 구성됩니다.
    4. 회원가입 ( ex. /register )
        - 클라이언트로부터 < email, password > 를 받아서 firebase ****에 사용자를 등록합니다.
            ( SDK Function : createUserWithEmailAndPassword() )
            
        - firebase로부터 받은 결과데이터 중 uid를 email, password와 함께 DB에 Insert 합니다.
            ( password는 ****bcrypt로 암호화 하여 Insert )
            
        - firebase의 거부응답에 대해 예외처리하여, 클라이언트에게 메세지를 보냅니다.
            ( 필수 : 이미 가입된 이메일인 경우 )
            
    5. 로그인 ( ex. /login )
        - 클라이언트로부터 < email, password > 를 받아서 firebase 에 로그인 합니다.
            ( SDK Function : signInWithEmailAndPassword() )
            
        - firebase의 거부응답에 대해 예외처리하여, 클라이언트에게 메세지를 보냅니다.        
            ( 필수 : 가입되지 않은 경우, 비밀번호가 틀린 경우 )
            
        - DB의 회원정보와 다른 경우에도 같은 체크 프로세스를 가집니다.
        - 로그인에 성공하면 랜덤한 값(Token)을 DB에 기록하고 클라이언트에게 내려줍니다.
    6. 주문 ( ex. /order )
        - 클라이언트로부터 < token, instrument_id, size, price, type1, type2  > 를 받습니다.
            ( instrument_id: 품목 / size: 주문수량 / price: 주문가격 / 
            type1: long, short 구분 / type2: 지정가, 시장가 구분 ) 
            
        - token이 일치하지 않거나 조건에 부합하지 않은 경우 예외처리하여 메세지를 내려줍니다.
        - OKEX 거래소의 Future OrderBook API (데이터 3번)를 호출하여, 해당 instrument_id 의 호가
            
            데이터를 수신하고, 클라이언트의 요청이 체결조건에 부합하는지 체크합니다. 
            
            체결조건
            1. Long(Short)주문은 Orderbook의 asks(bids)와 체결될 수 있다.
            2. 시장가 주문은 주문가격과 상관없이, Orderbook 순서대로 가능한 수량만큼 체결된다.
            3. 지정가 주문은 Orderbook의 가격과 비교하여 체결된다.
            - Long주문 :  Asks가격 ≤ 주문가격 ⇒ Asks 순서대로 가능한 수량만큼 체결된다.
            - Short주문 : Bids가격 ≥ 주문가격 ⇒ Bids 순서대로 가능한 수량만큼 체결된다.
            예시) 
            Orderbook Bids가 [가격 1.2, 수량 4] [가격 1.1, 수량 3] [가격 0.9, 수량 5] 인 경우,
            Short 주문 [가격 1.0, 수량 6]이 발생하면 [가격 1.2, 수량 4] [가격 1.1, 수량 2] 2건의 체결
            
        - 체결조건에 부합하면 [주문가격, 주문수량, 체결가격, 체결수량, 체결시각]을 DB에 Insert 하고,
            클라이언트에게 위 정보를 Json 형태로 내려줍니다.
            
    7. 조회 ( ex. /fetch )
        - 클라이언트로부터 < token, base_time > 을 받습니다.
        - token이 일치하지 않거나, 해당 내역이 존재하지 않은 경우 예외처리하여 메세지를 내려줍니다.
        - OKEX 거래소의 Future Ticker API (데이터 4번)를 호출하여, 해당 instrument_id 의 last 가격을
            
            수신하여 각 체결건의 평가손익을 계산합니다.
            
            평가손익
            1. 실제 체결된 가격과 조회시점의 가격으로 체결되는 경우의 금액차이
            2. Long주문 : (현재가격 x 체결수량) -  (체결가격 x 체결수량) 
            3. Short주문 : (체결가격 x 체결수량) -  (현재가격 x 체결수량) 
            
        - base_time 이후의 주문체결내역을 평가손익과 함께 Json Array 형태로 내려줍니다.

---

# 결과물

해당 결과물은 로컬 환경에서 node를 구동하여 테스트를 할 수 있는 프로그램 형태

# 참고 CommandLine

    ```sh
    cd {folder}

    # 의존성 설치
    npm install ((or) yarn)

    # 프로젝트 시작
    npm run serve ((or) yarn serve)
    ```