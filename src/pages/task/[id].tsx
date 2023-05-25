import { ReactElement } from "react";
import styles from "./styles.module.css";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { db } from "@/services/firebaseConnection";
import { doc, getDoc, query, collection, where } from "firebase/firestore";

//type TaskProps = {};

const task = (): ReactElement => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Detalhes da tarefa</title>
      </Head>
      <main className={styles.main}>
        <h1>tarefas</h1>
      </main>
    </div>
  );
};

export default task;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params ? (params.id as string) : "";
  const docRef = doc(db, "tarefas", id);
  const snapShot = await getDoc(docRef);

  if (!snapShot.data()) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (!snapShot.data()?.public) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const milieSeconds = snapShot.data()?.created.seconds * 1000;

  const task = {
    id: snapShot.id,
    user: snapShot.data()?.user,
    created: new Date(milieSeconds).toLocaleDateString(),
    public: snapShot.data()?.public,
    tarefa: snapShot.data()?.tarefa,
  };
  console.log(task);
  return {
    props: {},
  };
};
