-- El SEO de una alta nueva dependia de que yo desplegara a mano.
--
-- Toda la cadena de indexacion (prerender de fichas, prerender de contenido,
-- sitemap.xml y ping a IndexNow) vive dentro del `build` de package.json, asi
-- que se ejecuta solo cuando hay un deploy. Un profesional que se daba de alta
-- un martes no existia para Google hasta el siguiente commit. Ahora mismo no se
-- nota porque ha habido deploy 13 de los ultimos 14 dias, pero dos semanas sin
-- tocar el codigo dejan invisibles a todas las altas de esas dos semanas.
--
-- No se genera el sitemap en caliente a proposito: el sitemap solo debe listar
-- URLs cuyo HTML ya existe prerenderizado. Un sitemap dinamico anunciaria
-- fichas sin pagina y Google recibiria un soft-404 (la portada servida con
-- status 200), que es peor que no listar la URL — paso el 3 sep 2026 con 2 de
-- las 388 URLs. Por eso se dispara un rebuild completo: sitemap y HTML salen
-- siempre del mismo build y no pueden desincronizarse.
--
-- El Deploy Hook de Vercel no lleva cabecera de autorizacion: la URL es el
-- secreto. Eso evita de paso el bug de current_setting('app.service_role_key')
-- que tuvo los 4 cron de emails caidos 4 meses.
--
-- 05:30 UTC = 07:30 en España. Fuera de hora punta y a tiempo para el rastreo
-- de la mañana.

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'xpeak-sitemap-diario') THEN
    PERFORM cron.unschedule('xpeak-sitemap-diario');
  END IF;
END $$;

SELECT cron.schedule(
  'xpeak-sitemap-diario',
  '30 5 * * *',
  $job$
    SELECT net.http_post(
      url     := 'https://api.vercel.com/v1/integrations/deploy/prj_w3gLxBFmA7ipbZiUgOaYoIiemCwY/PEGAR_ID_DEL_DEPLOY_HOOK',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body    := '{}'::jsonb
    );
  $job$
);
