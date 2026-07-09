import { useRef, useEffect } from "react";
import { ValidationError, useForm } from "@formspree/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import PillButton from "../common/PillButton";
import styles from "./Contact.module.css";

const Contact = () => {
  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();
  const auth = customFields.formAPI;

  const [state, handleSubmit] = useForm(auth);
  const formRef = useRef();

  useEffect(() => {
    if (state.succeeded && !state.submitting) {
      toast.success("Successfully Submitted!");
      if (formRef.current !== undefined) {
        formRef.current.reset();
      }
    }
  }, [state.succeeded, state.submitting]);

  return (
    <div className={styles.card}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <form onSubmit={handleSubmit} ref={formRef} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-name">First name</label>
          <input
            id="contact-name"
            type="text"
            name="name"
            placeholder="What should I call you?"
            className={styles.input}
            required
          />
          <ValidationError field="name" prefix="Name" errors={state.errors} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-email">Email</label>
          <input
            id="contact-email"
            type="email"
            placeholder="So I can write back"
            name="email"
            className={styles.input}
            required
          />
          <ValidationError field="email" prefix="Email" errors={state.errors} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            name="message"
            rows="6"
            placeholder="What's on your mind?"
            className={styles.textarea}
          ></textarea>
        </div>
        <PillButton
          variant="primary"
          type="submit"
          disabled={state.submitting}
          className={styles.submitBtn}
        >
          Send it my way
        </PillButton>
        <div className={styles.formError}>
          <ValidationError errors={state.errors} />
        </div>
      </form>
    </div>
  );
};

export default Contact;
