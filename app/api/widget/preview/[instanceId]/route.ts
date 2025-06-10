import { NextRequest } from 'next/server';
import { DesignSettings } from '@/types/design';

export async function GET(
  request: NextRequest,
  { params }: { params: { instanceId: string } }
) {
  const { searchParams } = new URL(request.url);
  const fullPage = searchParams.get('fullPage') === 'true';
  const deployment = searchParams.get('deployment') === 'true';
  const configStr = searchParams.get('config');
  const config = configStr ? JSON.parse(configStr) as DesignSettings : null;

  // Create the HTML content for the preview
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Widget Preview</title>
  
  <!-- Load React and ReactDOM -->
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  
  <!-- Load Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Load the Widget component -->
  <script src="/_next/static/chunks/pages/_app.js"></script>
  <script src="/_next/static/chunks/main.js"></script>
  <script src="/_next/static/chunks/webpack.js"></script>
  <script src="/_next/static/chunks/pages/widget/[instanceId].js"></script>
  
  <!-- Load our widget initialization script -->
  <script src="/widget.js" defer></script>
  
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    #widget-root {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>
</head>
<body>
  <div id="widget-root"></div>
  <script>
    window.addEventListener('load', () => {
      // Wait for all scripts to load
      setTimeout(() => {
        if (window.initWidget) {
          window.initWidget('widget-root', {
            instanceId: '${params.instanceId}',
            config: ${JSON.stringify(config)},
            fullPage: ${fullPage},
            deployment: ${deployment}
          });
        } else {
          console.error('Widget initialization function not found');
        }
      }, 1000);
    });
  </script>
</body>
</html>
  `.trim();

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
} 