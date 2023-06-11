const typescript = require('@rollup/plugin-typescript')
const glsl = require('rollup-plugin-glsl')

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
            file: 'dist/iife/index.bundle.js',
            format: 'iife',
            name: 'ThreeManga'
        }
    ],
    plugins: [
        typescript(),
        glsl({
            include: '**/*.glsl',
        }),
    ],
}
