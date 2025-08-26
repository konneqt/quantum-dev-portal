import yaml from "js-yaml";

export function loadAllFilesContent(requireContext) {
  const extractContent = (content) =>
    content && typeof content === "object" && "default" in content
      ? content.default
      : content;

  const parseYamlContent = (data, key) => {
    if (typeof data === "string") {
      try {
        return yaml.load(data);
      } catch (error) {
        console.error(`Error parsing YAML in file ${key}:`, error);
        return null;
      }
    }
    return data;
  };

  const isYamlFile = (key) => key.endsWith(".yaml") || key.endsWith(".yml");

  const names = requireContext.keys();
  
  const files = names
    .map((key, index) => {
      try {
        const content = requireContext(key);
        const data = extractContent(content);
        const parsedData = isYamlFile(key) ? parseYamlContent(data, key) : data;
        
        const linkTitle = names[index]
          .replaceAll(" ", "")
          .split("/")
          .slice(1)
          .join("/")
          .split(".")[0];
        
        return { data: parsedData, linkTitle, key };
      } catch (error) {
        console.error(`Error loading file ${key}:`, error);
        return null;
      }
    })
    .filter(Boolean);

  if (files.length > 1) {
    return files.map((file) => {
      const api = file.data;
      const title = api.info?.title ?? `API`;
      const description = api.info?.description ?? "No description available";
      
      return {
        title,
        description,
        type: "api",
        slug: title.toLowerCase().replaceAll(" ", "").replaceAll(".", "-"),
        linkTitle: file.linkTitle,
      };
    });
  }

  if (files.length === 1) {
    const file = files[0];
    const api = file.data;
    const grouped: Record<string, { title: string; description: string; type: string; slug: string; linkTitle: string }> = {};

    for (const [, methods] of Object.entries<any>(api.paths || {})) {
      for (const [, operation] of Object.entries<any>(methods)) {
        const tag = operation.tags?.[0] || "General";
        if (!grouped[tag]) {
          grouped[tag] = {
            title: tag,
            description: operation.summary || `Endpoints related to ${tag}`,
            type: "group",
            slug: tag.toLowerCase().replaceAll(" ", "").replaceAll(".", "-"),
            linkTitle: file.linkTitle,
          };
        }
      }
    }

    return Object.values(grouped);
  }

  return [];
}