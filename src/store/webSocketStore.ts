import { WS_RES_TYPE } from "@/constants/api";
import { WSReqType } from "./../types/apiType";
// websocketStore.js
import { getBaseWsReq } from "@/utils/helper/apiHelper";
import { create } from "zustand";
import useResultStore from "./resultStore";

interface WebSocketStore {
  ws: WebSocket | null;
  connect: (url: string) => void;
  sendMessage: (type: WSReqType, data: string) => void;
  isStartSearching: boolean;
}

const useWebSocketStore = create<WebSocketStore>((set, get) => ({
  ws: null,
  isStartSearching: false,
  connect: (url: string) => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (response) => {
      const { type, data } = JSON.parse(response.data);
      console.log(data);
      switch (type) {
        case WS_RES_TYPE.START:
          set({ isStartSearching: true });
          break;
        case WS_RES_TYPE.ERROR:
          break;
        case WS_RES_TYPE.RESULT:
          useResultStore.getState().setUrlResult(data);
          break;
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    set({ ws: socket });
  },
  getStatus: () => {
    const socket = get().ws;

    if (socket) {
      return socket.readyState;
    }

    return null;
  },
  sendMessage: (type: WSReqType, data: string) => {
    const socket = get().ws;

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(getBaseWsReq(type, data));
    }
  },
}));

export default useWebSocketStore;
