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
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import Textarea from "@/components/textarea";
import { FaTrash } from "react-icons/fa";

type TaskProps = {
  item: {
    id: string;
    public: boolean;
    created: string;
    user: string;
    tarefa: string;
  };
  allComments: CommentProps[];
};

type CommentProps = {
  id: string;
  name: string;
  taskId: string;
  user: string;
  comment: string;
};

const task = ({ item, allComments }: TaskProps): ReactElement => {
  const { data: session } = useSession();
  const [input, setInput] = useState<string>("");
  const [comments, setComments] = useState<CommentProps[]>(allComments);

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

      const data = {
        id: docRef.id,
        comment: input,
        taskId: item.id,
        name: session.user.name,
        user: session.user.email,
      };
      setComments((prevValue) => [...prevValue, data]);
      setInput("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteComment = async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, "comments", id);
      await deleteDoc(docRef);
      const newComments = comments.filter((c) => c.id !== id);
      setComments(newComments);
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

      <section className={styles.commentsContainer}>
        <h2>Todos os Comentários</h2>
        {comments.length === 0 && <span>Nenhum Comentário foi encontrado</span>}

        {comments.map((item) => (
          <article className={styles.comment} key={item.id}>
            <div className={styles.headComment}>
              <label className={styles.commentsLabel}>{item.name}</label>
              {item.user === session?.user?.email && (
                <button
                  className={styles.buttonTrash}
                  onClick={() => handleDeleteComment(item.id)}
                >
                  <FaTrash size={18} color="#EA3140" />
                </button>
              )}
            </div>
            <p>{item.comment}</p>
          </article>
        ))}
      </section>
    </div>
  );
};

export default task;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params ? (params.id as string) : "";

  const q = query(collection(db, "comments"), where("taskId", "==", id));
  const snapshotComments = await getDocs(q);

  const allComments: CommentProps[] = [];

  snapshotComments.forEach((doc) => {
    allComments.push({
      user: doc.data().user,
      id: doc.id,
      comment: doc.data().comment,
      taskId: doc.data().taskId,
      name: doc.data().name,
    });
  });

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
    props: {
      item: task,
      allComments: allComments,
    },
  };
};
