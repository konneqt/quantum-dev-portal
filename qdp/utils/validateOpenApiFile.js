const yaml = require("js-yaml");

/**
 * Utility function to validate if content is a valid OpenAPI specification
 * @param {string|object} content 
 * @param {string} fileExtension 
 * @returns {object} 
 */
const validateOpenAPISpec = (content, fileExtension = '') => {
    try {
      let parsedContent;
      if (typeof content === 'string') {
        if (['.json', ''].includes(fileExtension.toLowerCase())) {
          try {
            parsedContent = JSON.parse(content);
          } catch (jsonError) {
            try {
              parsedContent = yaml.load(content);
            } catch (yamlError) {
              return { 
                valid: false, 
                message: `Could not parse content as JSON or YAML: ${jsonError.message}`
              };
            }
          }
        } else if (['.yaml', '.yml'].includes(fileExtension.toLowerCase())) {
          try {
            parsedContent = yaml.load(content);
          } catch (error) {
            return { valid: false, message: `Invalid YAML: ${error.message}` };
          }
        }
      } else if (typeof content === 'object') {
        parsedContent = content;
      } else {
        return { valid: false, message: `Unsupported content type: ${typeof content}` };
      }
  
      const isOpenAPI3 = parsedContent.openapi && parsedContent.openapi.startsWith('3.');
      const isSwagger2 = parsedContent.swagger && parsedContent.swagger.startsWith('2.');
      
      const hasInfo = parsedContent.info && typeof parsedContent.info === 'object';
      const hasPaths = parsedContent.paths && typeof parsedContent.paths === 'object';
      
      if (!(isOpenAPI3 || isSwagger2)) {
        return { 
          valid: false, 
          message: "Missing or invalid OpenAPI/Swagger version (must be 2.x or 3.x)" 
        };
      }
      
      if (!hasInfo) {
        return { valid: false, message: "Missing 'info' section in the specification" };
      }
      
      if (!hasPaths) {
        return { valid: false, message: "Missing 'paths' section in the specification" };
      }
  
      return { 
        valid: true,
        specVersion: isOpenAPI3 ? 'openapi3' : 'swagger2',
        parsedContent
      };
    } catch (error) {
      return { valid: false, message: `Error validating OpenAPI spec: ${error.message}` };
    }
  };

  module.exports = validateOpenAPISpec;