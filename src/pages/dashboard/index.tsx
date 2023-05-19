import { ReactElement, useState, ChangeEvent, FormEvent } from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import styles from "./styles.module.css";
import Head from "next/head";
import Textarea from "@/components/textarea";

type TypeForm = {
  task: string;
  public: boolean;
};

const Dashboard = (): ReactElement => {
  const [form, setForm] = useState<TypeForm>({ task: "", public: true });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    console.log(form);
  }

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
          <article className={styles.task}>
            <div className={styles.tagContainer}>
              <label htmlFor="" className={styles.tag}>
                PUBLICO
              </label>
              <button className={styles.shareButton}>
                <FiShare2 size={22} color="#3183ff" />
              </button>
            </div>

            <div className={styles.taskContent}>
              <p>Minha primeira tarefa de exemplo show demais</p>
              <button className={styles.trashButton}>
                <FaTrash size={24} color="#ea3140" />
              </button>
            </div>
          </article>
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
