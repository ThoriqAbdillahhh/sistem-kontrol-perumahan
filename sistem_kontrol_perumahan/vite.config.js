import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({

            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],

    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    },

});