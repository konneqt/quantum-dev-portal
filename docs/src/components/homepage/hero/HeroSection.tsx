import React from "react";
import Link from "@docusaurus/Link";
import {
  LiveRegular,
  ArchiveRegular,
  GridRegular,
} from "@fluentui/react-icons";

import "./hero.css"; // Importação do CSS puro

interface HeroProductProps {
  link: string;
  title: string;
  icon: React.ComponentType<{ className: string }>;
  text: string;
}

const PRODUCTS = [
  {
    title: "Introduction",
    link: "/intro",
    icon: GridRegular,
    text: "Understand the structure of the project, and if it is not necessary for you, feel free to delete this page.",
  },
  {
    title: "Quantum Api Dev Portal",
    link: "/quantum-dev-portal/docs",
    icon: LiveRegular,
    text: "Use our Dev Portal and document your APIs in a dynamic way, with a pleasant and easy-to-understand layout.",
  },
];

function HeroProduct({ link, title, icon: Icon, text }: HeroProductProps) {
  return (
    <div className="hero-product">
      <Link to={link} className="hero-product-link">
        <div className="hero-product-content">
          <h3 className="hero-product-title">
            <Icon className="hero-product-icon" />
            <div>{title}</div>
          </h3>
          <p className="hero-product-text">{text}</p>
        </div>
      </Link>
    </div>
  );
}

export default function HeroSection() {
  return (
    <div className="noise-bg hero-section">
      <section className="hero-header ">
        <div className="hero-header-content">
          <h2>Welcome to the Quantum API Dev Portal!</h2>
          <p>
            Our API Dev Portal is an environment designed to offer a more
            intuitive and organized experience when viewing your API
            documentation. Using Docusaurus, we provide a modern and pleasant
            interface, facilitating access to essential information for
            developers.
          </p>
        </div>
      </section>

      <section className="hero-products">
        {PRODUCTS.map((product) => (
          <HeroProduct {...product} key={product.title} />
        ))}
      </section>
    </div>
  );
}
