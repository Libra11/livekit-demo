/*
 * @Author: Libra
 * @Date: 2023-05-25 13:33:38
 * @LastEditTime: 2023-05-25 15:43:12
 * @LastEditors: Libra
 * @Description:
 */
import koaRouter from "koa-router";
import createToken from "../token/createToken";
const router = new koaRouter();

router.get("/token", async (ctx) => {
  const token = await createToken(ctx);
  ctx.body = {
    code: 200,
    data: token,
  };
});
export default router.routes();
