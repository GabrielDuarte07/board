import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import styles from "./styles.module.css";
import Head from "next/head";
import Textarea from "@/components/textarea";

const Dashboard = (): ReactElement => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Meu painel de tarefas</title>
      </Head>

      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual sua tarefa?</h1>
            <form>
              <Textarea placeholder="Digite qual sua tarefa" />
              <div className={styles.checkboxArea}>
                <input type="checkbox" className={styles.checkbox} />
                <label htmlFor="">Deixar Tarefa publica?</label>
              </div>
              <button className={styles.button}>Registrar</button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
