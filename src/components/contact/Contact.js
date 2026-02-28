import React, { useRef, useEffect } from "react";
import { ValidationError, useForm } from "@formspree/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Translate from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./Contact.module.css"; // Import the CSS module

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
    <section className={styles["contact-page"]}>
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
      <article className={styles["contact-form"]}>
        <h3>
          <Translate>I’d love to hear from you!</Translate>
        </h3>
        <p>Whether you're:</p>
        <ul>
          <li>Exploring potential collaborations or opportunities</li>
          <li>Seeking guidance in setting up personal or organizational knowledge management systems</li>
          <li>Wishing to share feedback, ask questions, or start a conversation</li>
        </ul>
        <form onSubmit={handleSubmit} ref={formRef}>
          <div className={styles["form-group"]}>
            <input
              type="text"
              name="name"
              placeholder="First Name"
              className={styles["form-control"]}
              required
            />
            <ValidationError
              field="name"
              prefix="Name"
              errors={state.errors}
            />
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              className={styles["form-control"]}
              required
            />
            <ValidationError
              field="email"
              prefix="Email"
              errors={state.errors}
            />
            <textarea
              name="message"
              rows="5"
              placeholder="How can I help you?"
              className={styles["form-control"]}
            ></textarea>
            <button
              type="submit"
              disabled={state.submitting}
              className={`${styles["submit-btn"]} btn`}
            >
              <Translate>Send</Translate>
            </button>
            <div className={styles["form-error"]}>
              <ValidationError errors={state.errors} />
            </div>
          </div>
        </form>
      </article>
    </section>
  );
};

export default Contact;