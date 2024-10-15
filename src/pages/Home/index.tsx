import { SearchIcon } from "@/components/icons/SearchIcon";
import { WS_REQ_TYPE } from "@/constants/api";
import useWebSocketStore from "@/store/webSocketStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

const Home = () => {
  const sendMessage = useWebSocketStore((state) => state.sendMessage);
  const isStartSearching = useWebSocketStore((state) => state.isStartSearching);
  const navigator = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) return;
    sendMessage(WS_REQ_TYPE.SITEMAP_URL, searchTerm);
    setSearchTerm("");
  };

  useEffect(() => {
    if (isStartSearching) {
      navigator("/results");
    }
  }, [isStartSearching, navigator]);

  return (
    <div className={styles["search-container"]}>
      <form onSubmit={handleSearch} className={styles["search-form"]}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search website url..."
          className={styles["search-input"]}
        />
        <button
          type="submit"
          className={styles["search-button"]}
          aria-label="Search"
        >
          <SearchIcon />
        </button>
      </form>
    </div>
  );
};

export default Home;
