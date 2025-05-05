// src/components/OWASPValidator/utils.js

// OWASP category mapping
export const owaspMap = {
    "Broken Object Level Authorization": {
      id: "API1:2023",
      name: "Broken Object Level Authorization",
      description: "APIs tend to expose endpoints that handle object identifiers, creating a wide attack surface of Object Level Access Control issues."
    },
    "Broken Authentication": {
      id: "API2:2023",
      name: "Broken Authentication",
      description: "Authentication mechanisms are often implemented incorrectly, allowing attackers to compromise authentication tokens or exploit implementation flaws."
    },
    "Broken Object Property Level Authorization": {
      id: "API3:2023",
      name: "Broken Object Property Level Authorization",
      description: "This focuses on the API's handling of data access at property levels, where properties requiring additional access controls are exposed."
    },
    "Unrestricted Resource Consumption": {
      id: "API4:2023",
      name: "Unrestricted Resource Consumption",
      description: "APIs do not properly restrict the size or number of resources that can be requested by the client, potentially leading to denial of service."
    },
    "Broken Function Level Authorization": {
      id: "API5:2023",
      name: "Broken Function Level Authorization",
      description: "Complex access control policies with different hierarchies, groups, and roles are often implemented incorrectly, restricting access to certain functions."
    },
    "Unrestricted Access to Sensitive Business Flows": {
      id: "API6:2023",
      name: "Unrestricted Access to Sensitive Business Flows",
      description: "APIs tend to expose business flows that should be restricted or rate-limited to prevent abuse."
    },
    "Server Side Request Forgery": {
      id: "API7:2023",
      name: "Server Side Request Forgery",
      description: "APIs might fetch a remote resource server-side without properly validating the user-supplied URL, enabling attacks on cloud services."
    },
    "Security Misconfiguration": {
      id: "API8:2023",
      name: "Security Misconfiguration",
      description: "Security misconfiguration can happen at any level of the API stack, from network to application, including insecure default configurations or incomplete configurations."
    },
    "Improper Inventory Management": {
      id: "API9:2023",
      name: "Improper Inventory Management",
      description: "APIs tend to expose more endpoints than traditional web applications, making proper and updated documentation crucial for security."
    },
    "Unsafe Consumption of APIs": {
      id: "API10:2023",
      name: "Unsafe Consumption of APIs",
      description: "Developers tend to trust data received from third-party APIs more than user input, not properly validating responses before using them."
    },
    "Insufficient Logging & Monitoring": {
      id: "API11:2023",
      name: "Insufficient Logging & Monitoring", 
      description: "Insufficient logging and monitoring, coupled with missing or ineffective integration with incident response, allows attackers to further attack systems."
    }
  };
  
  // Determine severity based on OWASP category
  export const getSeverityText = (category) => {
    if (category.includes("API1") || category.includes("API2"))
      return "Critical";
    if (
      category.includes("API3") ||
      category.includes("API4") ||
      category.includes("API5")
    )
      return "High";
    if (
      category.includes("API6") ||
      category.includes("API7") ||
      category.includes("API8")
    )
      return "Medium";
    return "Low";
  };
    
  // Get color based on severity - funciona com Docusaurus
  export const getSeverityColor = (severity) => {
    switch (severity) {
      case "Critical":
        return "#f44336"; // Vermelho funciona bem em ambos os temas
      case "High":
        return "#ff9800"; // Laranja funciona bem em ambos os temas
      case "Medium":
        return "#ff9800"; // Laranja claro
      case "Low":
        return "#4caf50"; // Verde
      default:
        return "#f44336"; // Default para vermelho
    }
  };
    
  // Determine color based on score - funciona com Docusaurus
  export const getScoreColor = (score) => {
    if (score >= 8) return "#4caf50"; // Verde para pontuação alta
    if (score >= 5) return "#ff9800"; // Laranja para pontuação média
    return "#f44336"; // Vermelho para pontuação baixa
  };
    
  // Get score description
  export const getScoreDescription = (score) => {
    if (score >= 8) return "Good";
    if (score >= 5) return "Needs attention";
    return "Critical";
  };
    
  // Process and normalize the validation results
  export const processResults = (results) => {
    if (!results || !results.analysis || !results.analysis.owaspViolations) {
      return results;
    }
      
    // Process OWASP violations
    results.analysis.owaspViolations = results.analysis.owaspViolations.map((violation) => {
      if (!violation.severity) {
        // Map descriptive category to API format if necessary
        const apiCategory = owaspMap[violation.category]?.id || violation.category;
          
        // Apply severity logic
        violation.severity = getSeverityText(apiCategory);
      }
      return violation;
    });
      
    return results;
  };
  