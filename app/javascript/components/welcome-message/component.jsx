// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { memo } from "react";

import css from "./styles.css";

function WelcomeMessage() {
  return (
    <div className={css.welcomeContainer}>
      <h2 className={css.welcomeHeading}>Welcome to Primero</h2>
      <p className={css.welcomeText}>
        Your open source case management solution for child protection, GBV, and other social services.
      </p>
    </div>
  );
}

WelcomeMessage.displayName = "WelcomeMessage";

export default memo(WelcomeMessage);
