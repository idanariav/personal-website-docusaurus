import React from "react";

import styles from "./Newsletter.module.css";

export const Newsletter = ({ data }) => {
  const {
    action,
    method,
    emailFieldName,
    firstNameFieldName,
    submitButtonName,
  } = data;

  return (
    <div className={styles.newsWrapper}>
      <div className="container padding-vert--lg">
        <h2>Join the Journey</h2>
        <p>Philosopher's Code offers practical philosophy </p>
        <p>brought to life through simple, thoughtful visuals</p>
        <p>Subscribe to start your journey with the <em>Five Quests for a Philosophical Life</em> guide</p>

        <form
          action={action}
          className={styles.form}
          method={method}
          target="_blank"
        >
          <input
            name={emailFieldName}
            placeholder="Email Address"
            type="email"
            required
          />
          <input name={firstNameFieldName} placeholder="First Name (optional)" />
          <div
            style={{ position: "absolute", left: "-5000px" }}
            aria-hidden="true"
          >
            <input
              type="text"
              name="b_4ed0fd1909674fddee53ac3e7_dfdcae99f5"
              tabIndex={-1}
              value=""
            />
          </div>
          <button
            type="submit"
            name={submitButtonName}
            className="button button--primary"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};