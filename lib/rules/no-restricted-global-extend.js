/**
 * @fileoverview Disallow extending the global scope by extending objects that reference it (e.g. 'window')
 * @author cowchimp
 * @copyright 2016 cowchimp. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {},

    schema: {
      "type": "array",
      "items": {
        "type": "string"
      },
      "uniqueItems": true
    }
  },

  create: function(context) {
    var globalScopeIdentifiers = context.options;
    if (globalScopeIdentifiers.length === 0) {
      return {};
    }

    var globalScope;

    return {
      "Program": function() {
        globalScope = context.getScope();
      },

      "MemberExpression": function(node) {
        if(node.object.type === "Identifier" && isGlobalObject(node.object) && !isGlobalProperty(node.property)) {
          context.report(node, "'{{propertyName}}' piggybacks on '{{objectName}}' to extend the global scope", { propertyName: node.property.name, objectName: node.object.name });
        }
      }
    };

    function isGlobalObject(node) {
      return globalScopeIdentifiers.some(function(identifier) {
        return identifier == node.name;
      });
    }

    function isGlobalProperty(node) {
      return globalScope.variables.some(function(variable) {
        return variable.name == node.name;
      });
    }
  }
};