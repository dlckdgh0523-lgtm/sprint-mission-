import express from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";

const router = express.Router();
const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const wrap = (handler) => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (e) {
    console.error(`Error: [${req.method}] ${req.originalUrl}`);
    console.error(e);
    res.status(500).send({ message: "Server Error" });
  }
};

// [1] 상품 댓글 등록
router.post(
  "/products/:productId",
  upload.single("image"),
  wrap(async (req, res) => {
    const { productId } = req.params;
    const { content } = req.body;
    const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null;

    if (!content && !imagePath)
      return res.status(400).send({ message: "내용/사진 필수" });

    const comment = await prisma.productComment.create({
      data: {
        content: content || "",
        image: imagePath,
        product_id: Number(productId),
      },
    });
    res.status(201).send(comment);
  })
);

// [2] 상품 댓글 조회
router.get(
  "/products/:productId",
  wrap(async (req, res) => {
    const { productId } = req.params;
    const { cursor, limit = 50 } = req.query;

    let options = {
      where: { product_id: Number(productId) },
      take: Number(limit),
      // 🔥 [수정됨] created_at -> createdAt
      orderBy: { createdAt: "desc" },
    };

    if (cursor) {
      options.cursor = { id: Number(cursor) };
      options.skip = 1;
    }

    const comments = await prisma.productComment.findMany(options);
    const nextCursor =
      comments.length === Number(limit)
        ? comments[comments.length - 1].id
        : null;
    res.send({ data: comments, nextCursor });
  })
);

// [3] 게시글 댓글 등록
router.post(
  "/articles/:articleId",
  upload.single("image"),
  wrap(async (req, res) => {
    const { articleId } = req.params;
    const { content } = req.body;
    const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null;

    if (!content && !imagePath)
      return res.status(400).send({ message: "내용/사진 필수" });

    const comment = await prisma.articleComment.create({
      data: {
        content: content || "",
        image: imagePath,
        article_id: Number(articleId),
      },
    });
    res.status(201).send(comment);
  })
);

// [4] 게시글 댓글 조회
router.get(
  "/articles/:articleId",
  wrap(async (req, res) => {
    const { articleId } = req.params;
    const { cursor, limit = 50 } = req.query;

    let options = {
      where: { article_id: Number(articleId) },
      take: Number(limit),
      // 🔥 [수정됨] created_at -> createdAt
      orderBy: { createdAt: "desc" },
    };

    if (cursor) {
      options.cursor = { id: Number(cursor) };
      options.skip = 1;
    }

    const comments = await prisma.articleComment.findMany(options);
    const nextCursor =
      comments.length === Number(limit)
        ? comments[comments.length - 1].id
        : null;
    res.send({ data: comments, nextCursor });
  })
);

export default router;
