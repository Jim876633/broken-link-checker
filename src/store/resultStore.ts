import { create } from "zustand";

export interface ScanUrlResult {
  parentUrl: string;
  url: string;
  type: string;
  isExist: boolean;
  statusCode: number;
}

interface ResultStore {
  urlResultList: ScanUrlResult[];
  urlResultListGroupByType: { type: string; results: ScanUrlResult[] }[];
  setUrlResult: (result: ScanUrlResult) => void;
}

const useResultStore = create<ResultStore>((set) => ({
  urlResultList: [],
  urlResultListGroupByType: [],
  setUrlResult: (result: ScanUrlResult) => {
    set((state) => ({
      urlResultList: [...state.urlResultList, result],
    }));
    set((state) => {
      let typeItems = state.urlResultListGroupByType.find(
        (obj) => obj.type === result.type
      );
      if (typeItems) {
        typeItems.results = [...typeItems.results, result];
      } else {
        typeItems = { type: result.type, results: [result] };
      }
      return {
        urlResultListGroupByType: [
          ...state.urlResultListGroupByType.filter(
            (obj) => obj.type !== result.type
          ),
          typeItems,
        ],
      };
    });
  },
}));

export default useResultStore;
