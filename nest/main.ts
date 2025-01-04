import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    // 先处理 Vite 的中间件
    app.use(vite.middlewares);

    // 确保 API 路由在 SSR 处理之前
    app.use('/api/*', (req, res, next) => {
      if (req.originalUrl.startsWith('/api/')) {
        return next();
      }
    });

    // SSR 处理
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;

      // 跳过 API 请求
      if (url.startsWith('/api/')) {
        return next();
      }

      try {
        let template = fs.readFileSync(
          path.resolve(process.cwd(), 'index.html'),
          'utf-8',
        );

        template = await vite.transformIndexHtml(url, template);

        const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');

        const rendered = await render(url);

        const html = template
        .replace(`<!--ssr-outlet-->`, rendered.html)
        .replace(`<!--app-data-->`, `<script>window.__INITIAL_DATA__=${JSON.stringify(rendered.initialProps)}</script>`);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const dist = path.resolve(process.cwd(), 'dist');
    app.useStaticAssets(path.join(dist, 'client'));

    const template = fs.readFileSync(
      path.resolve(dist, 'client/index.html'),
      'utf-8',
    );
    const { render } = await import(
      path.resolve(dist, 'server/entry-server.js')
    );

    // 确保 API 路由在 SSR 处理之前
    app.use('/api/*', (req, res, next) => {
      if (req.originalUrl.startsWith('/api/')) {
        return next();
      }
    });

    app.use('*', async (req, res) => {
      const url = req.originalUrl;

      // 跳过 API 请求
      if (url.startsWith('/api/')) {
        return;
      }

      try {
        const appHtml = await render(url);
        const html = template.replace(`<!--ssr-outlet-->`, appHtml);

        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        console.error(e);
        res.status(500).end((e as Error).stack);
      }
    });
  }

  await app.listen(5173);
  console.log('http://localhost:5173');
}

bootstrap();
