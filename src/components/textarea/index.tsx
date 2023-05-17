import { HTMLProps, ReactElement } from "react";
import styles from "./styles.module.css";

const Textarea = ({
  ...rest
}: HTMLProps<HTMLTextAreaElement>): ReactElement => {
  return <textarea className={styles.textarea} {...rest}></textarea>;
};

export default Textarea;
