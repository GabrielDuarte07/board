import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Image from "next/image";

import heroImg from "../../public/assets/hero.png";
import { GetStaticProps } from "next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/firebaseConnection";
import task from "./task/[id]";

type HomeProps = {
  commenstSize: number;
  postsSize: number;
};

export default function Home({ commenstSize, postsSize }: HomeProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image
            className={styles.hero}
            alt="Logo Tarefas+"
            src={heroImg}
            priority
          />
        </div>
        <h1 className={styles.title}>
          Sistema feito para você organizar <br /> seus estudos e tarefas
        </h1>

        <div className={styles.infoContent}>
          <section className={styles.box}>
            <span>+{postsSize} Posts</span>
          </section>
          <section className={styles.box}>
            <span>+{commenstSize} comentários</span>
          </section>
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const tasksRef = collection(db, "tarefas");
  const commentsRef = collection(db, "comments");

  const comments = await getDocs(commentsRef);
  const tasks = await getDocs(tasksRef);

  return {
    props: {
      commenstSize: comments.size,
      postsSize: tasks.size,
    },
    revalidate: 60,
  };
};
