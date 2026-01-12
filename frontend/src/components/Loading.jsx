import styles from "./Loading.module.css";

const Loading = () => {
    return (
        <div className={styles.loaderContainer}>
            <div className={styles.bouncingDots}>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
            </div>
        </div>
    );
};

export default Loading;
