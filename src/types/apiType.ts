import { WS_REQ_TYPE, WS_RES_TYPE } from "@/constants/api";

export type WSReqType = (typeof WS_REQ_TYPE)[keyof typeof WS_REQ_TYPE];

export type WSResType = (typeof WS_RES_TYPE)[keyof typeof WS_RES_TYPE];
