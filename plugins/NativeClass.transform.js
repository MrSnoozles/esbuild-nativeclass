"use strict";
exports.__esModule = true;
var ts = require("typescript");
/**
 * A TypeScript transform that compiles classes marked with @NativeClass as es5 & commonjs
 *
 * @param ctx
 */
function default_1(ctx) {
    function isNativeClassExtension(node) {
        return (node.decorators &&
            node.decorators.filter(function (d) {
                var fullText = d.getFullText().trim();
                return fullText.indexOf('@NativeClass') > -1;
            }).length > 0);
    }
    function visitNode(node) {
        if (ts.isClassDeclaration(node) && isNativeClassExtension(node)) {
            return createHelper(node);
        }
        return ts.visitEachChild(node, visitNode, ctx);
    }
    function createHelper(node) {
        // we remove the decorator for now!
        return ts.createIdentifier(ts
            .transpileModule(node.getText().replace(/@NativeClass(\((.|\n)*?\))?/gm, ''), {
            compilerOptions: {
                noEmitHelpers: true,
                module: ts.ModuleKind.CommonJS,
                target: ts.ScriptTarget.ES5
            }
        })
            .outputText.replace(/(Object\.defineProperty\(.*?{.*?)(enumerable:\s*false)(.*?}\))/gs, '$1enumerable: true$3'));
    }
    return function (source) {
        return ts.updateSourceFileNode(source, ts.visitNodes(source.statements, visitNode));
    };
}
exports["default"] = default_1;
