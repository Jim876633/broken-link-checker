import Details from "./components/Details";
import Summary from "./components/Summary";
import styles from "./index.module.scss";

const Results = () => {
  // const urlResultList = useResultStore((state) => state.urlResultList);

  return (
    <div className={styles.result}>
      <Summary />
      <Details />
    </div>
  );
};
export default Results;
