import {
  IconArrowRight,
} from "@tabler/icons-react";
import React from "react";
import yaml from "js-yaml";
import { Link } from "react-router-dom";

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

const requireContext = require.context("../../../cli/apis", false, /\.(json|ya?ml)$/);

const loadAllFilesContent = (requireContext, yaml) => {
  const extractContent = (content) => 
    content && typeof content === 'object' && 'default' in content 
      ? content.default 
      : content;

  const parseYamlContent = (data, key) => {
    if (typeof data === "string") {
      try {
        return yaml.load(data);
      } catch (error) {
        console.error(`Erro ao parsear YAML no arquivo ${key}:`, error);
        return null;
      }
    }
    return data;
  };

  const isYamlFile = (key) => key.endsWith(".yaml") || key.endsWith(".yml");

  return requireContext.keys()
    .map((key: any) => {
      try {
        const content = requireContext(key);
        const data = extractContent(content);
        
        return isYamlFile(key) 
          ? parseYamlContent(data, key)
          : data;
      } catch (error) {
        console.error(`Erro ao carregar arquivo ${key}:`, error);
        return null;
      }
    })
    .filter(Boolean); 
};

const allFilesContent = loadAllFilesContent(requireContext, yaml);


console.log("Arquivos carregados:", allFilesContent);

const names = requireContext.keys();

const featureList: Feature[] = allFilesContent.map(
  (file: any, index: number) => {
    const linkTitle = names[index]
      .replaceAll(" ", "")
      .split("/")
      .slice(1)
      .join("/")
      .split(".")[0];

    const description = file?.info?.description
      ? file.info.description.length > 250
        ? file.info.description.slice(0, 250) + "..."
        : file.info.description
      : "Sem descrição";

    const title = file?.info?.title || "Sem título";

    return {
      link: `/docs/${linkTitle}/${title.toLowerCase().replaceAll(" ", "").replaceAll(".", "-")}`,
      title,
      content: description,
    };
  }
);

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
      <h1 className="feature-mainText">Explore nossas APIs</h1>
      <p className="feature-description">
        Descubra como nossas APIs podem transformar seu desenvolvimento e
        impulsionar seus projetos com inovação e eficiência.
      </p>
      <div className="feature-container">
        {featureList.map((feature, idx) => (
          <FeatureComponent key={idx} {...feature} />
        ))}
      </div>
    </>
  );
}
