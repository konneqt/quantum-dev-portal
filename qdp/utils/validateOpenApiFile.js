const yaml = require("js-yaml");

/**
 * Utility function to validate if content is a valid OpenAPI specification
 * Performs comprehensive validation of OpenAPI specifications
 * 
 * @param {string|object} content - The OpenAPI content to validate
 * @param {string} fileExtension - File extension or file name
 * @returns {object} - An object with valid, message, issues, criticalIssues, and other properties
 */
const validateOpenAPISpec = (content, fileExtension = '') => {
  try {
    let parsedContent;
    
    // Parse content if it's a string
    if (typeof content === 'string') {
      if (['.json', ''].includes(fileExtension.toLowerCase()) || 
          fileExtension.toLowerCase().endsWith('.json')) {
        try {
          parsedContent = JSON.parse(content);
        } catch (jsonError) {
          try {
            parsedContent = yaml.load(content);
            if (!parsedContent) throw new Error("Empty or invalid YAML content");
          } catch (yamlError) {
            return { 
              valid: false, 
              message: `Could not parse content as JSON or YAML: ${jsonError.message}`,
              issues: [`Could not parse content as JSON or YAML: ${jsonError.message}`],
              criticalIssues: [`Could not parse content as JSON or YAML: ${jsonError.message}`],
              length: 1
            };
          }
        }
      } else if (['.yaml', '.yml'].includes(fileExtension.toLowerCase()) || 
                 fileExtension.toLowerCase().endsWith('.yaml') || 
                 fileExtension.toLowerCase().endsWith('.yml')) {
        try {
          parsedContent = yaml.load(content);
          if (!parsedContent) throw new Error("Empty or invalid YAML content");
        } catch (error) {
          return { 
            valid: false, 
            message: `Invalid YAML: ${error.message}`,
            issues: [`Invalid YAML: ${error.message}`],
            criticalIssues: [`Invalid YAML: ${error.message}`],
            length: 1
          };
        }
      } else {
        try {
          parsedContent = JSON.parse(content);
        } catch (jsonError) {
          try {
            parsedContent = yaml.load(content);
            if (!parsedContent) throw new Error("Empty or invalid content");
          } catch (yamlError) {
            return { 
              valid: false, 
              message: `Could not determine content format: ${jsonError.message}`,
              issues: [`Could not determine content format: ${jsonError.message}`],
              criticalIssues: [`Could not determine content format: ${jsonError.message}`],
              length: 1
            };
          }
        }
      }
    } else if (typeof content === 'object') {
      parsedContent = content;
    } else {
      return { 
        valid: false, 
        message: `Unsupported content type: ${typeof content}`,
        issues: [`Unsupported content type: ${typeof content}`],
        criticalIssues: [`Unsupported content type: ${typeof content}`],
        length: 1
      };
    }
    
    const issues = [];
    const criticalIssues = [];

    // Check for openapi or swagger field
    const isOpenAPI3 = parsedContent.openapi && parsedContent.openapi.startsWith('3.');
    const isSwagger2 = parsedContent.swagger && parsedContent.swagger.startsWith('2.');

    if (!isOpenAPI3 && !isSwagger2) {
      criticalIssues.push("Missing or invalid OpenAPI/Swagger version (must be 2.x or 3.x)");
    }

    // Check info
    if (!parsedContent.info) {
      criticalIssues.push("Missing required 'info' section");
    } else {
      if (!parsedContent.info.title) issues.push("Missing 'info.title'");
      if (!parsedContent.info.version) issues.push("Missing 'info.version'");
    }

    // Check servers
    if (isOpenAPI3 && (!parsedContent.servers || parsedContent.servers.length === 0)) {
      issues.push("Missing 'servers' section - No base URLs defined");
    } else if (parsedContent.servers) {
      parsedContent.servers.forEach((server, index) => {
        if (!server.url) {
          issues.push(`'servers[${index}].url' not defined`);
        }
      });
    }

    // Check paths
    if (!parsedContent.paths || Object.keys(parsedContent.paths).length === 0) {
      criticalIssues.push("Missing 'paths' section or no endpoints defined");
    } else {
      for (const path in parsedContent.paths) {
        const pathItem = parsedContent.paths[path];
        const methods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'];
        const hasMethod = methods.some(method => pathItem[method]);

        if (!hasMethod) {
          issues.push(`Path '${path}' doesn't contain any valid HTTP method`);
        } else {
          for (const method in pathItem) {
            if (methods.includes(method)) {
              const operation = pathItem[method];

              if (!operation.operationId) {
                issues.push(`Missing operationId in ${method.toUpperCase()} ${path}`);
              }

              if (!operation.responses || Object.keys(operation.responses).length === 0) {
                issues.push(`'${method.toUpperCase()} ${path}' has no defined responses`);
              }

              if (operation.parameters) {
                operation.parameters.forEach((param) => {
                  if (param.required && !param.schema) {
                    issues.push(`'${method.toUpperCase()} ${path}' - required parameter '${param.name}' has no schema defined`);
                  }
                });
              }

              if (['post', 'put', 'patch'].includes(method) && !operation.requestBody) {
                issues.push(`'${method.toUpperCase()} ${path}' has no requestBody defined`);
              }
            }
          }
        }
      }
    }

    // Check components.schemas if $ref is used
    const hasRefs = JSON.stringify(parsedContent).includes('"$ref"');
    if (hasRefs && (!parsedContent.components || !parsedContent.components.schemas || Object.keys(parsedContent.components.schemas || {}).length === 0)) {
      issues.push("There are schema references ($ref), but 'components.schemas' is not properly defined");
    }

    const result = { 
      valid: criticalIssues.length === 0,
      message: (criticalIssues[0] || issues[0] || ''),
      issues,
      criticalIssues,
      length: issues.length,
      specVersion: isOpenAPI3 ? 'openapi3' : (isSwagger2 ? 'swagger2' : 'unknown'),
      parsedContent
    };

    result[Symbol.iterator] = function* () {
      for (let i = 0; i < issues.length; i++) {
        yield issues[i];
      }
    };

    return result;
  } catch (error) {
    const result = { 
      valid: false, 
      message: `Error validating OpenAPI spec: ${error.message}`,
      issues: [`Error validating OpenAPI spec: ${error.message}`],
      criticalIssues: [`Error validating OpenAPI spec: ${error.message}`],
      length: 1
    };

    result[Symbol.iterator] = function* () {
      yield result.issues[0];
    };

    return result;
  }
};

module.exports = validateOpenAPISpec;
