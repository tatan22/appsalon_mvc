import gulpPkg from 'gulp'; // Importar el paquete completo
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import terser from 'gulp-terser';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { glob } from 'glob';

// Extraer las funciones necesarias de gulp
const { src, dest, watch, series } = gulpPkg;

const sass = gulpSass(dartSass);

// Rutas
const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js'
};

// Tareas
export function css(done) {
    src(paths.scss, { sourcemaps: true })
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(dest('./public/build/css', { sourcemaps: '.' }));
    done();
}

export function js(done) {
    src(paths.js)
        .pipe(terser())
        .pipe(dest('./public/build/js'));
    done();
}

export async function imagenes(done) {
    const srcDir = './src/img';
    const buildDir = './public/build/img';
    const images = await glob('./src/img/**/*');

    const promises = images.map(async (file) => {
        const relativePath = path.relative(srcDir, path.dirname(file));
        const outputSubDir = path.join(buildDir, relativePath);
        await procesarImagenes(file, outputSubDir);
    });

    await Promise.all(promises);
    done();
}

async function procesarImagenes(file, outputSubDir) {
    if (!fs.existsSync(outputSubDir)) {
        fs.mkdirSync(outputSubDir, { recursive: true });
    }
    const baseName = path.basename(file, path.extname(file));
    const extName = path.extname(file).toLowerCase();

    if (extName === '.svg') {
        const outputFile = path.join(outputSubDir, `${baseName}${extName}`);
        fs.copyFileSync(file, outputFile);
    } else {
        const outputFile = path.join(outputSubDir, `${baseName}${extName}`);
        const outputFileWebp = path.join(outputSubDir, `${baseName}.webp`);
        const outputFileAvif = path.join(outputSubDir, `${baseName}.avif`);
        const options = { quality: 80 };

        await sharp(file).jpeg(options).toFile(outputFile);
        await sharp(file).webp(options).toFile(outputFileWebp);
        await sharp(file).avif().toFile(outputFileAvif);
    }
}

export function dev() {
    watch(paths.scss, css);
    watch(paths.js, js);
    watch('src/img/**/*.{png,jpg}', imagenes);
}

export default series(js, css, imagenes, dev);
export const build =  series( js, css, imagenes )
