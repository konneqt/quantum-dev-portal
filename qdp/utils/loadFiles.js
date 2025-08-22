import yaml from "js-yaml";

/** chamar nos componentes:
 * // HomepageFeatures.tsx
import { loadAllFilesContent } from "../../utils/fileUtils";

const requireContext = require.context("../../../cli/apis", false, /\.(json|ya?ml)$/);
const allFilesContent = loadAllFilesContent(requireContext);
**/

export function loadAllFilesContent(requireContext) {
  const extractContent = (content) =>
    content && typeof content === 'object' && 'default' in content
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

  return requireContext.keys()
    .map((key) => {
      try {
        const content = requireContext(key);
        const data = extractContent(content);

        return isYamlFile(key)
          ? parseYamlContent(data, key)
          : data;
      } catch (error) {
        console.error(`Error loading file${key}:`, error);
        return null;
      }
    })
    .filter(Boolean);
}
