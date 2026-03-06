[v] class 키워드를 이용한 Product / ElectronicProduct 클래스 정의
[v] Product 프로퍼티(name, description, price, tags, images, favoriteCount) 및 favorite() 메소드 구현
[v] ElectronicProduct가 Product를 상속하며 manufacturer 프로퍼티 추가
[v] Article 클래스 정의 및 like() 메소드 구현
[v] Article 클래스에 createdAt(생성일자) 프로퍼티 추가 및 constructor에서 현재 시간 저장
[v] 각 클래스 마다 constructor 작성
[v] 추상화/캡슐화/상속/다형성을 고려하여 코드를 작성해 주세요.

Article API 요청 함수 구현 (.then/.catch)
[v] getArticleList() : GET 메소드 사용 (page, pageSize, keyword 쿼리 파라미터 이용)
[v] getArticle() : GET 메소드 사용
[v] createArticle() : POST 메소드 사용 (title, content, image request body 포함)
[v] patchArticle() : PATCH 메소드 사용
[v] deleteArticle() : DELETE 메소드 사용
[v] fetch 혹은 axios 이용
[v] 응답의 상태 코드가 2XX가 아닐 경우, 에러 메시지를 콘솔에 출력해 주세요.
[x] .then() 메소드를 이용하여 비동기 처리를 해주세요.
[v] .catch() 를 이용하여 오류 처리를 해주세요.
[v] ProductService.js 파일에 Product API 관련 함수들을 작성해 주세요.

Product API 요청 함수 구현 (async/await)
[v] getProductList() : GET 메소드 사용 (page, pageSize, keyword 쿼리 파라미터를 이용해 주세요.)
[v] getProduct() : GET 메소드를 사용해 주세요.
[x] createProduct() : POST 메소드를 사용해 주세요. (name, description, price, tags, images request body 포함)
[v] patchProduct() : PATCH 메소드를 사용해 주세요.
[v] deleteProduct() : DELETE 메소드를 사용해 주세요.
[v] async/await 을 이용하여 비동기 처리를 해주세요.
[v] try/catch 를 이용하여 오류 처리를 해주세요.
[v] getProductList()를 통해서 받아온 상품 리스트를 각각 인스턴스로 만들어 products 배열에 저장해 주세요.
[v] 해시태그에 "전자제품"이 포함되어 있는 상품들은 ElectronicProduct 클래스를 사용해 인스턴스를 생성해 주세요.
[x] 나머지 상품들은 모두 Product 클래스를 사용해 인스턴스를 생성해 주세요.

파일 구조 및 실행
[v] ProductService.js 파일 분리 (Product API)
[v] ArticleService.js 파일 분리 (Article API)
[x] 이외의 코드들은 모두 main.js 파일에 작성 (import 활용)
[v] 각 함수를 실행하는 코드를 작성하고, 제대로 동작하는지 확인해 주세요.
**아직 완전하게 익힌게 아니라 자꾸 오류가 나와서 test.js를 분리했습니다.**
