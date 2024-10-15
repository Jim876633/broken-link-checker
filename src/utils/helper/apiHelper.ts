import { WSReqType, WSResType } from "@/types/apiType";

export const getBaseWsReq = (type: WSReqType, data: unknown) => {
  return JSON.stringify({
    type,
    data,
    timestamp: Date.now(),
  });
};

export const getBaseWsRes = (type: WSResType, data: unknown) => {
  return JSON.stringify({
    type,
    data,
    timestamp: Date.now(),
  });
};
