import { ReactElement, useState, ChangeEvent, FormEvent } from "react";
import styles from "./styles.module.css";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { db } from "@/services/firebaseConnection";
import {
  doc,
  getDoc,
  query,
  collection,
  where,
  addDoc,
} from "firebase/firestore";
import Textarea from "@/components/textarea";

type TaskProps = {
  item: {
    id: string;
    public: boolean;
    created: string;
    user: string;
    tarefa: string;
  };
};

const task = ({ item }: TaskProps): ReactElement => {
  const { data: session } = useSession();
  const [input, setInput] = useState<string>("");

  const handleComment = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!session?.user?.email || !session?.user?.name || input === "") return;

    try {
      const docRef = await addDoc(collection(db, "comments"), {
        comment: input,
        created: new Date(),
        user: session.user.email,
        name: session.user.name,
        taskId: item.id,
      });
      setInput("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Detalhes da tarefa</title>
      </Head>

      <main className={styles.main}>
        <h1>tarefas</h1>
        <article className={styles.task}>
          <p>{item.tarefa}</p>
        </article>
      </main>

      <section className={styles.commentsContainer}>
        <h2>Deixar Comentário</h2>
        <form onSubmit={handleComment}>
          <Textarea
            placeholder="Digite o seu comentario..."
            value={input}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setInput(e.target.value)
            }
          />
          <button disabled={!session?.user} className={styles.button}>
            Enviar comentrio
          </button>
        </form>
      </section>
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
  return {
    props: { item: task },
  };
};
