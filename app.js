import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// 라우터
import productRouter from "./router/productrouter.js";
import articleRouter from "./router/articlerouter.js";
import commentRouter from "./router/commentrouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 🔥 [중요] 로그인(BasicAuth) 코드 삭제함!
// 이제 누구나 업로드 가능 (에러 원인 제거)

// 정적 파일 연결
app.use("/uploads", express.static("uploads"));
app.use(express.static("public"));

// 요청 로그 찍기 (서버 살아있는지 확인용)
app.use((req, res, next) => {
  console.log(`👉 [${req.method}] ${req.url}`);
  next();
});

// 라우터 연결
app.use("/products", productRouter);
app.use("/articles", articleRouter);
app.use("/comments", commentRouter);

// 404 에러
app.use((req, res, next) => {
  res.status(404).send({ error: "페이지를 찾을 수 없습니다 (404)" });
});

app.listen(PORT, () => {
  console.log(`🚀 서버 정상 가동 중: http://localhost:${PORT}`);
});

export default app;
