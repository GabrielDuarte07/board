import {
  ReactElement,
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
} from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import styles from "./styles.module.css";
import Head from "next/head";
import Link from "next/link";
import Textarea from "@/components/textarea";

import { db } from "@/services/firebaseConnection";
import {
  addDoc,
  collection,
  where,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";

type TypeForm = {
  task: string;
  public: boolean;
};

type PropsDashboard = {
  user: {
    email: string;
  };
};

type TaskProps = {
  id: string;
  created: Date;
  public: boolean;
  tarefa: string;
  user: string;
};

const Dashboard = ({ user: { email } }: PropsDashboard): ReactElement => {
  const [form, setForm] = useState<TypeForm>({ task: "", public: true });
  const [tasks, setTasks] = useState<TaskProps[]>([]);

  useEffect(() => {
    async function loadTarefas() {
      const collectionRef = collection(db, "tarefas");
      const q = query(
        collectionRef,
        orderBy("created", "desc"),
        where("user", "==", email)
      );
      onSnapshot(q, (snapshot) => {
        const taskList: TaskProps[] = [];

        snapshot.forEach((doc) => {
          taskList.push({
            id: doc.id,
            created: doc.data().created,
            tarefa: doc.data().tarefa,
            user: doc.data().user,
            public: doc.data().public,
          });
        });
        setTasks(taskList);
      });
    }
    loadTarefas();
  }, [email, tasks]);

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();

    if (!form.task) return;
    try {
      await addDoc(collection(db, "tarefas"), {
        tarefa: form.task,
        created: new Date(),
        public: form.public,
        user: email,
      });
      setForm({ task: "", public: false });
    } catch (err) {
      console.log(err);
    }
  }

  const handleShare = async (id: string): Promise<void> => {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/task/${id}`
    );
    alert("url copiada");
  };

  const handleDeleteTask = async (id: string): Promise<void> => {
    const docRef = doc(db, "tarefas", id);
    await deleteDoc(docRef);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Meu painel de tarefas</title>
      </Head>

      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual sua tarefa?</h1>
            <form onSubmit={handleSubmit}>
              <Textarea
                placeholder="Digite qual sua tarefa"
                name="task"
                value={form.task}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setForm({ ...form, [e.target.name]: e.target.value })
                }
              />
              <div className={styles.checkboxArea}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  name="public"
                  checked={form.public}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setForm({ ...form, [e.target.name]: e.target.checked })
                  }
                />
                <label htmlFor="public">Deixar Tarefa publica?</label>
              </div>
              <button className={styles.button}>Registrar</button>
            </form>
          </div>
        </section>

        <section className={styles.taskContainer}>
          <h1>Minhas tarefas</h1>
          {tasks.map((item) => (
            <article key={item.id} className={styles.task}>
              {item.public && (
                <div className={styles.tagContainer}>
                  <label htmlFor="" className={styles.tag}>
                    PUBLICO
                  </label>
                  <button
                    className={styles.shareButton}
                    onClick={() => handleShare(item.id)}
                  >
                    <FiShare2 size={22} color="#3183ff" />
                  </button>
                </div>
              )}

              <div className={styles.taskContent}>
                {item.public || item.user ? (
                  <Link href={`/task/${item.id}`}>
                    <p>{item.tarefa}</p>
                  </Link>
                ) : (
                  <p>{item.tarefa}</p>
                )}

                <button
                  className={styles.trashButton}
                  onClick={() => handleDeleteTask(item.id)}
                >
                  <FaTrash size={24} color="#ea3140" />
                </button>
              </div>
            </article>
          ))}
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
    props: {
      user: {
        email: session.user.email,
      },
    },
  };
};
