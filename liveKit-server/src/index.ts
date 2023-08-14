/*
 * @Author: Libra
 * @Date: 2023-05-25 11:43:16
 * @LastEditTime: 2023-08-14 10:35:36
 * @LastEditors: Libra
 * @Description:
 */
import Koa from "koa";
import consola from "consola";
import KoaRouter from "koa-router";
import tokenRouter from "./router/token";
import cors from "koa2-cors";
const app = new Koa();
const router = new KoaRouter();

//跨域
app.use(
  cors({
    origin: "*",
  })
);
//封装接口
router.use("/api", tokenRouter);
//配置路由模块
app.use(router.routes()).use(router.allowedMethods());
const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 3000;
app.listen({ port, host });
consola.ready({
  message: `Server listening on http://${host}:${port}`,
  badge: true,
});
