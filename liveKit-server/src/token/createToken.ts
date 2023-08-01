/*
 * @Author: Libra
 * @Date: 2023-05-25 13:37:41
 * @LastEditTime: 2023-07-26 13:33:14
 * @LastEditors: Libra
 * @Description:
 */
import Application from "koa";
import koaRouter from "koa-router";
import { AccessToken } from "livekit-server-sdk";

export default function createToken(
  ctx: Application.ParameterizedContext<
    any,
    koaRouter.IRouterParamContext<any, {}>,
    any
  >
) {
  const { identity, roomName: room } = ctx.request.query;
  console.log("identity", identity, room);
  const token = new AccessToken("devkey", "secret", {
    identity: identity as string,
  });
  token.addGrant({
    roomJoin: true,
    canUpdateOwnMetadata: true,
    room: room as string,
  });
  return token.toJwt();
}
