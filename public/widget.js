// Widget initialization script
window.initWidget = function(rootId, options) {
  const { instanceId, config, fullPage, deployment } = options;
  
  // Create widget container
  const container = document.getElementById(rootId);
  if (!container) {
    console.error('Widget root element not found:', rootId);
    return;
  }

  // Load React and Next.js runtime
  const script = document.createElement('script');
  script.src = '/_next/static/chunks/pages/_app.js';
  script.onload = () => {
    // Initialize the widget component
    const widgetProps = {
      instanceId,
      controlsOnly: false,
      designConfig: config,
      fullPage,
      deployment,
      className: 'w-full h-full'
    };

    // Render the widget
    if (window.React && window.ReactDOM) {
      const element = React.createElement(Widget, widgetProps);
      ReactDOM.render(element, container);
    }
  };
  document.head.appendChild(script);
}; 