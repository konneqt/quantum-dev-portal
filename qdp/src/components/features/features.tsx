import { IconArrowRight } from "@tabler/icons-react";
import React from "react";
import { Link } from "react-router-dom";
import { loadAllFilesContent } from "../../../utils/loadFiles";

interface Feature {
  title: string;
  content: string;
  link: string;
}

declare var require: {
  context(
    path: string,
    recursive?: boolean,
    regExp?: RegExp
  ): {
    keys(): string[];
    <T = any>(id: string): T;
  };
};

const requireContext = require.context(
  "../../../cli/apis",
  false,
  /\.(json|ya?ml)$/
);
const allFilesContent = loadAllFilesContent(requireContext);

console.log("Arquivos carregados:", allFilesContent);

const featureList: Feature[] = allFilesContent.map((file: any) => {
  const maxLength = 250;
  const desc = file.description || "No description available...";

  const description =
    desc.length > maxLength ? desc.slice(0, maxLength) + "..." : desc;

  return {
    // Agora usa o linkTitle do arquivo e o slug do título
    link: `/docs/${file.linkTitle}/${file.title.trim().toLowerCase().replaceAll(" ", "-").replaceAll(".", "-")}`,
    title: file.title,
    content: description,
  };
});

function FeatureComponent({ title, content, link }: Feature) {
  return (
    <Link className="feature-card clickable-card" to={link}>
      <div className="feature-header">
        <h3 className="feature-title">{title}</h3>
        <div className="feature-icon">
          <IconArrowRight size={40} stroke={1.5} />
        </div>
      </div>
      <p className="feature-content">{content}</p>
    </Link>
  );
}

export default function HomepageFeatures() {
  return (
    <>
      <h1 className="feature-mainText">Explore our APIs</h1>
      <p className="feature-description">
        Discover how our APIs can transform your development and drive your
        projects forward with innovation and efficiency.
      </p>
      <div className="feature-container">
        {featureList.map((feature, idx) => (
          <FeatureComponent key={idx} {...feature} />
        ))}
      </div>
    </>
  );
}