import { EgressClient, EncodedFileType } from "livekit-server-sdk";

/*
 * @Author: Libra
 * @Date: 2023-08-14 10:24:49
 * @LastEditors: Libra
 * @Description:
 */
const egressClient = new EgressClient(
  "http://127.0.0.1:7880",
  "devkey",
  "secret"
);

const output = {
  fileType: EncodedFileType.MP4,
  filepath: "livekit-demo/room-composite-test.mp4",
  s3: {
    accessKey: "ddd",
    secret: "ddd",
    region: "ddd",
    bucket: "libra-livekit",
  },
};

export async function startRecord() {
  const info = await egressClient.startRoomCompositeEgress("123", output, {
    layout: "speaker",
    // uncomment to use your own templates
    // customBaseUrl: 'https://my-template-url.com',
  });
  const egressID = info.egressId;
  console.log("egressID", egressID);
}
