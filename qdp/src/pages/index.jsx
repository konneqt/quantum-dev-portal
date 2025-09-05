import BrowserOnly from "@docusaurus/BrowserOnly";
import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import { clsx } from "clsx";
import React, { useEffect, useState } from "react";
import HomepageFeatures from "../components/features/features";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styleConfig from '../../../styles.config.json';

const description =
  "Explore detailed documentation, integration guides, and testing tools designed to simplify and accelerate your connection to our solutions. Everything you need to build, integrate, and innovate—all in one place.";

function Home() {
  const { i18n } = useDocusaurusContext();

  Object.entries(styleConfig.colors).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });


  return (
    <Layout description={translate({ message: description, id: "home.desc" })}>
      <Head>
        <title>Quantum API DevPortal</title>
      </Head>
      <main className="main">
        <div className="hero">
          <div className="heroContainer">
            <div className="textContainer">
              <h1 className={clsx("heroTitle")}>
                {i18n.currentLocale === "en" && (
                  <>
                    <span >Quantum API</span>
                    <br />
                    <span>Developer Portal</span>
                  </>
                )}
              </h1>
              <p className="description">
                <Translate id="home.desc">{description}</Translate>
              </p>
              <div className={clsx("buttonGroup")}>
                <Link to="/docs/apis" className="primaryButton">
                  <Translate id="home.getstarted">Get Started →</Translate>
                </Link>
              </div>
            </div>

            <div className="imageContainer">
              <BrowserOnly>
                {() => {
                  const darkImg = useBaseUrl(styleConfig.heroUrlDark);
                  const lightImg = useBaseUrl(styleConfig.heroUrl);
                  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
                  const imgSrc = isDark ? darkImg : lightImg;
                  return (
                    <img
                      src={imgSrc}
                      alt="Vale Card Developer Portal Preview"
                      className="heroImage"
                    />
                  );
                }}
              </BrowserOnly>
            </div>
          </div>
        </div>

        <HomepageFeatures />
      </main>
    </Layout>
  );
}

export default Home;
