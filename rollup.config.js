const typescript = require('@rollup/plugin-typescript')
const glslLoader = require('rollup-plugin-glsl-loader')

module.exports = {
    input: 'src/index.ts',
    output: [
        {
            dir: 'dist/esm',
            format: 'esm',
            preserveModules: true,
        }, {
            dir: 'dist/cjs',
            format: 'cjs',
            preserveModules: true,
        },
        {
            file: 'dist/browser/index.module.bundle.js',
            format: 'esm',
        }
    ],
    plugins: [
        typescript(),
        glslLoader(),
    ],
}
