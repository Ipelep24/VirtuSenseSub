VirtuSense

RtcEngine.ts handles all the background processes, from controling the mic, cam, remote mic and cam, end call, release, join, and even the FER function.

Each webpack runs depending on the one you need, in this case, we use wepback.web.config.js. Every webpack also uses the webpack.common.js, meaning webpack.web or webpack.wsdk
uses the webpack.common that might result in conflict if not handled correctly, such as data handling and file handling.

API folder only works on vercel production, meaning every function that relies on those API won't work on localhost, unlike in Next.js.