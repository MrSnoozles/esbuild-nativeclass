const { readFile } = require('fs/promises');
const ts = require('typescript');
const transform = require('./NativeClass.transform.js');

/**
 * Parses source code and transpiles classes decorated with @NativeClass to ES5
 * @param sourceCode
 * @returns {string}
 */
const transformSourceCode = (sourceCode) => {
    let sourceFile = ts.createSourceFile(
        'source.ts', sourceCode, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS
    );

    const result = ts.transform(
        sourceFile, [ transform.default ]
    );

    const transformedSourceFile = result.transformed[0];

    result.dispose();

    const printer = ts.createPrinter();
    return printer.printFile(transformedSourceFile);
};



module.exports = {
    name: 'nativeClassDecorator',

    setup(build) {
        // When loading .ts files, check if the file contains classes
        //  decorated with @NativeClass. If it does, convert these decorated
        //  classes to es5 + commonjs syntax.
        build.onLoad({ filter: /\.ts/ }, async (args) => {
            let data;

            try {
                data = await readFile(args.path, 'utf8');

                if(data.includes('@NativeClass')){
                    // @NativeClass FOUND: parse source code
                    let sourceCode = data.toString();
                    let transformedSourceCode = transformSourceCode(sourceCode);

                    return {
                        contents: transformedSourceCode,
                        loader: 'ts'
                    }
                }
                else {
                    // @NativeClass NOT FOUND, nothing to do
                }
            }
            catch(e) {
                // file could not be opened or error occurred
            }
            
            return {
                contents: data.toString(),
                loader: 'ts',
            }
        });
    },
};