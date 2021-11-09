# MySQL DB Schema

* DB Name: trading
* DB Tables: user, order_result
* Relation: order_result의 user_id가 user의 id와 FOREIGN KEY로 Relation 되어 있음.

## 사용자 정보 (user)
```sql
mysql> SHOW COLUMNS FROM user;
+----------+--------------+------+-----+---------+----------------+
| Field    | Type         | Null | Key | Default | Extra          |
+----------+--------------+------+-----+---------+----------------+
| id       | int          | NO   | PRI | NULL    | auto_increment |
| uid      | varchar(50)  | YES  |     | NULL    |                |
| email    | varchar(50)  | YES  |     | NULL    |                |
| password | varchar(100) | YES  |     | NULL    |                |
| token    | varchar(200) | YES  |     | NULL    |                |
+----------+--------------+------+-----+---------+----------------+
```

* id: 사용자의 고유 id 번호
* uid: firebase에서 발급받은 고유 id
* email: 로그인을 위한 이메일 주소
* password: 로그인을 위한 비밀번호
* token: 로그인 여부를 확인하는 랜덤 값

## 주문 결과 목록 (order_result)
```sql
mysql> SHOW COLUMNS FROM order_result;
+---------------+-------------+------+-----+---------+-------+
| Field         | Type        | Null | Key | Default | Extra |
+---------------+-------------+------+-----+---------+-------+
| user_id       | int         | YES  | MUL | NULL    |       |
| instrument_id | varchar(50) | YES  |     | NULL    |       |
| order_price   | varchar(50) | YES  |     | NULL    |       |
| order_size    | int         | YES  |     | NULL    |       |
| exec_price    | varchar(50) | YES  |     | NULL    |       |
| exec_size     | int         | YES  |     | NULL    |       |
| exec_time     | datetime    | YES  |     | NULL    |       |
+---------------+-------------+------+-----+---------+-------+
```

* user_id: 주문을 체결한 user의 id와 FOREIGN KEY로 relation 된 번호
* instrument_id: 주문을 체결한 
* order_price: 요청한 주문 가격
* order_size: 요청한 주문 수량
* exec_price: 체결한 가격
* exec_size: 체결한 수량
* exec_time: 체결한 시간
