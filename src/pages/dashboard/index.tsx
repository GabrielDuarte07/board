import { ReactElement } from "react";
import styles from "./styles.module.css";
import Head from "next/head";

const Dashboard = (): ReactElement => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Meu painel de tarefas</title>
      </Head>

      <h1>pagina painel</h1>
    </div>
  );
};

export default Dashboard;
