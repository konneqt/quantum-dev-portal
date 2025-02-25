import React from 'react';
import Link from '@docusaurus/Link';
import { ArrowUpRight } from 'react-feather';
import Head from '@docusaurus/Head';
import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useColorMode } from '@docusaurus/theme-common';
import "./apiReference.css"

export default function APIReferenceSection() {

  const { colorMode } = useColorMode();
  // Usando useBaseUrl para garantir o caminho correto das imagens
  const lightImage = useBaseUrl('/apiWhite.png');
  const darkImage = useBaseUrl('/apiDark.png');

  const imageSrc = colorMode === 'dark' ? darkImage : lightImage;

  return (
    <section className="api-reference-section">
    <Head>
      <link rel="prefetch" href={lightImage} />
      <link rel="prefetch" href={darkImage} />
    </Head>
    <div className="api-reference-container">
      <Link
        to="/quantum-dev-portal/docs"
        aria-label="API Reference"
        target="_blank"
        className="api-reference-link"
      >
        <ArrowUpRight className="h-6 w-6 text-zinc-400 dark:text-black" />
      </Link>
      <div className="api-reference-content">
        <h2>Quantum API Dev Portal</h2>
        <p>
          Explore the Quantum API Dev Portal and discover an intuitive, easy-to-navigate interface designed to make documenting your APIs more accessible and understandable. Navigate through clear and organized documentation, making the process of exploring and using your APIs more agile and efficient.
        </p>
        <Link
          to="/quantum-dev-portal/docs"
          className="get-started-link"
        >
          Get started with Quantum API Dev Portal &rarr;
        </Link>
      </div>
      <div className="api-reference-image-container">
        <img
          className="api-reference-image"
          alt="API Reference Preview"
          src={imageSrc}
        />
    
      </div>
    </div>
  </section>
  );
}
