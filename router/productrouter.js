import express from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";

const router = express.Router();
const prisma = new PrismaClient();

// 1. 이미지 저장소 설정 (Multer)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// 2. 에러 래퍼 (서버 안 죽게)
const wrap = (handler) => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (e) {
    console.error(`❌ Product Error: [${req.method}] ${req.originalUrl}`);
    console.error(e); // 터미널에 에러 자세히 찍힘
    res.status(500).send({ message: "Server Error" });
  }
};

// ==========================================
// [1] 상품 목록 조회
// ==========================================
router.get(
  "/",
  wrap(async (req, res) => {
    const { page = 1, pageSize = 10, search = "" } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);

    // 검색 조건
    const where = {
      OR: [
        { last_name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    };

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" }, // 최신순
      skip,
      take: Number(pageSize),
    });
    res.send(products);
  })
);

// ==========================================
// 🔥 [2] 상품 등록 (여기가 중요!)
// upload.single("image")가 있어야 FormData(사진+글)를 받습니다.
// ==========================================
router.post(
  "/",
  upload.single("image"),
  wrap(async (req, res) => {
    // 1. FormData로 들어온 데이터 꺼내기
    const { last_name, description, price, tags } = req.body;

    // 2. 필수 값 체크
    if (!last_name || !price) {
      return res.status(400).send({ message: "상품명과 가격은 필수입니다." });
    }

    // 3. 이미지 경로 처리 (파일 없으면 null)
    // 윈도우 역슬래시(\)를 슬래시(/)로 변경
    const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null;

    // 4. 데이터 변환 (문자열 -> 숫자/배열)
    // FormData는 모든 걸 '문자열'로 보내기 때문에 숫자로 바꿔줘야 합니다.
    const priceInt = Number(price);
    const tagArray = tags
      ? tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t)
      : [];

    // 5. DB 저장
    const newProduct = await prisma.product.create({
      data: {
        last_name,
        description,
        price: priceInt, // 숫자로 변환된 가격
        tags: tagArray, // 배열로 변환된 태그
        image: imagePath, // 이미지 경로
      },
    });
    res.status(201).send(newProduct);
  })
);

// [3] 상세 조회
router.get(
  "/:id",
  wrap(async (req, res) => {
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: { viewCount: { increment: 1 } },
    });
    res.send(product);
  })
);

// [4] 수정
router.patch(
  "/:id",
  wrap(async (req, res) => {
    const { id } = req.params;
    // 수정할 때도 가격이 오면 숫자로 바꿔줘야 함
    if (req.body.price) req.body.price = Number(req.body.price);

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.send(product);
  })
);

// [5] 삭제
router.delete(
  "/:id",
  wrap(async (req, res) => {
    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  })
);

export default router;
