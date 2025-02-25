import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import HeroSection from '../components/homepage/hero/HeroSection';
import Footer from '../components/homepage/footer/HomeFooter';
import APIReferenceSection from "../components/homepage/apiReference/APIReferenceSection"

export default function Homepage() {
  return (
    <Layout
      title="Quantum API Dev Portal"
      wrapperClassName="homepage flex flex-col"
    >
      <Head>
        <link rel="prefetch" href="/assets/css/elements.min.css" />
      </Head>

      <HeroSection />

      <APIReferenceSection />

    </Layout>
  );
}
