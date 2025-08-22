/**
 * Dynamic API analyzer to generate simple tags and summaries
 */

class DynamicApiAnalyzer {
  constructor() {
    this.methodActions = {
      get: 'Retrieve',
      post: 'Create',
      put: 'Update',
      patch: 'Modify',
      delete: 'Delete',
      options: 'Get options for',
      head: 'Get headers for'
    };
  }

  /**
   * Remove prefixos comuns e normaliza o path
   * @private
   */
  _cleanPath(pathKey) {
    let path = pathKey.startsWith('/') ? pathKey.slice(1) : pathKey;
    // remove api/v1, v2, etc.
    path = path.replace(/^(api\/)?v\d+\//i, '');
    return path;
  }

  /**
   * Extrai segmentos do path
   * @private
   */
  _extractSegments(path) {
    return path
      .split('/')
      .filter(Boolean)
      .map(segment => ({
        original: segment,
        clean: segment.replace(/[{}]/g, ''),
        isParameter: segment.startsWith('{') && segment.endsWith('}'),
        normalized: this._normalizeSegment(segment)
      }));
  }

  /**
   * Normaliza um segmento
   * @private
   */
  _normalizeSegment(segment) {
    return segment
      .replace(/[{}]/g, '')
      .replace(/[-_]/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .toLowerCase()
      .trim();
  }

  /**
   * Formata um recurso como tag (capitaliza)
   * @private
   */
  _formatResourceTag(resource) {
    return resource
      .split(' ')
      .map(word => this._capitalizeFirst(word))
      .join(' ');
  }

  /**
   * Capitaliza a primeira letra
   * @private
   */
  _capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Cria tags simples com base no primeiro agrupador do path
   */
  generateTags(pathKey) {
    const cleanPath = this._cleanPath(pathKey);
    const segments = this._extractSegments(cleanPath);

    // Pega o primeiro segmento que não é parâmetro
    const firstResource = segments.find(seg => !seg.isParameter)?.normalized;

    if (firstResource) {
      return [this._formatResourceTag(firstResource)];
    }

    return ['API Operations']; // fallback
  }

  /**
   * Cria resumo baseado no método e no recurso
   */
  generateSummary(pathKey, method) {
    const cleanPath = this._cleanPath(pathKey);
    const segments = this._extractSegments(cleanPath);

    const action = this.methodActions[method.toLowerCase()] || this._capitalizeFirst(method);
    const resource = segments.find(seg => !seg.isParameter)?.normalized || 'resource';

    const isCollection = !segments.some(seg => seg.isParameter);

    if (method.toLowerCase() === 'get') {
      return isCollection
        ? `${action} ${this._formatResourceTag(resource)}`
        : `${action} ${this._formatResourceTag(resource)} details`;
    } else if (method.toLowerCase() === 'post') {
      return `${action} new ${this._formatResourceTag(resource)}`;
    } else if (['put', 'patch'].includes(method.toLowerCase())) {
      return `${action} existing ${this._formatResourceTag(resource)}`;
    } else if (method.toLowerCase() === 'delete') {
      return `${action} ${this._formatResourceTag(resource)}`;
    }

    return `${action} ${this._formatResourceTag(resource)}`;
  }
}

// Singleton instance para uso global
const apiAnalyzer = new DynamicApiAnalyzer();

function createDynamicTags(pathKey) {
  return apiAnalyzer.generateTags(pathKey);
}

function createDynamicSummary(pathKey, method) {
  return apiAnalyzer.generateSummary(pathKey, method);
}

module.exports = {
  DynamicApiAnalyzer,
  createDynamicTags,
  createDynamicSummary,
  apiAnalyzer
};
