import useResultStore from "@/store/resultStore";
import styles from "./index.module.scss";

const Summary = () => {
  // const urlResultListGroupByType = useResultStore(
  //   (state) => state.urlResultListGroupByType
  // );
  const urlResultList = useResultStore((state) => state.urlResultList);
  const workingLinks = urlResultList.filter((item) => item.isExist);
  const brokenLinks = urlResultList.filter((item) => !item.isExist);
  return (
    <div className={styles.summary}>
      <h3>Total Links</h3>
      <p>{urlResultList.length}</p>
      <h3>Working Links</h3>
      <p>{workingLinks.length}</p>
      <h3>Broken Links</h3>
      <p>{brokenLinks.length}</p>
    </div>
  );
};
export default Summary;
