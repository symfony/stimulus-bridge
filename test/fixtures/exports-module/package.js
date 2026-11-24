globalThis.mockExportsModuleRan = true;

module.exports = {
    symfony: {
        controllers: {
            mock: {
                main: 'dist/controller.js',
            },
        },
    },
};
