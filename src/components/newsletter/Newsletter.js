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
        <h2>Subscribe to the Newsletter</h2>
        <p>Get my latest content by email. Unsubscribe at any time.</p>

        <form
          action={action}
          className={styles.form}
          method={method}
          target="_blank"
        >
          <input
            name={emailFieldName}
            placeholder="Your email"
            type="email"
            required
          />
          <input name={firstNameFieldName} placeholder="Your first name" />
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