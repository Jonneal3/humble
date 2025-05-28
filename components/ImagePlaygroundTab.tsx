interface DesignTabProps {
  customStyles?: {
    container?: React.CSSProperties;
    header?: React.CSSProperties;
    title?: React.CSSProperties;
    subtitle?: React.CSSProperties;
    border?: React.CSSProperties;
    brand?: React.CSSProperties;
  };
  title?: string;
  subtitle?: string;
}

export function DesignTab({
  customStyles,
  title,
  subtitle,
}: DesignTabProps) {
  const [referenceImage, setReferenceImage] = useState<string | null>(null);

  return (
    <div 
      className="min-h-screen py-4 sm:py-6 px-3 sm:px-6 lg:px-8"
      style={customStyles?.container}
    >
      {title && (
        <div className="mb-4 sm:mb-6" style={customStyles?.header}>
          <h1 
            className="text-xl sm:text-2xl font-semibold text-center mb-2"
            style={customStyles?.title}
          >
            {title}
          </h1>
          {subtitle && (
            <p 
              className="text-sm text-center opacity-60"
              style={customStyles?.subtitle}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Left Column - Input Controls */}
        <div className="space-y-4 sm:space-y-6 lg:col-span-1">
          {/* Reference Image Upload */}
          <div 
            className="rounded-xl border-2 border-dashed p-3 sm:p-4 text-center hover:border-primary/50 transition-colors cursor-pointer"
            style={{
              backgroundColor: customStyles?.container?.backgroundColor,
              borderColor: customStyles?.border?.color || 'rgba(0, 0, 0, 0.1)',
              opacity: 0.8
            }}
          >
            {!referenceImage ? (
              <div className="space-y-2">
                <div className="mx-auto w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-xs sm:text-sm">
                  <span className="font-medium">Click to upload</span> or drag and drop
                </div>
                <p className="text-xs opacity-60">PNG, JPG up to 10MB</p>
              </div>
            ) : (
              <div className="relative aspect-square">
                <img 
                  src={referenceImage || ''} 
                  alt="Reference" 
                  className="rounded-lg object-cover w-full h-full"
                />
                <button 
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                  onClick={() => setReferenceImage(null)}
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Prompt Input */}
          <PromptInput
            onSubmit={handlePromptSubmit}
            isLoading={isLoading}
            showProviders={showProviders}
            onToggleProviders={() => setShowProviders(prev => !prev)}
            mode={mode}
            onModeChange={handleModeChange}
            suggestions={getRandomSuggestions()}
            customStyles={{
              container: {
                backgroundColor: customStyles?.container?.backgroundColor,
              },
              input: {
                backgroundColor: customStyles?.container?.backgroundColor,
                color: customStyles?.title?.color,
                border: `1px solid ${customStyles?.border?.color || 'rgba(0, 0, 0, 0.1)'}`,
                borderRadius: '0.75rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.2s ease',
              },
              button: {
                backgroundColor: customStyles?.container?.backgroundColor,
                color: customStyles?.title?.color,
                border: `1px solid ${customStyles?.border?.color || 'rgba(0, 0, 0, 0.1)'}`,
                transition: 'all 0.2s ease',
              },
              suggestionButton: {
                backgroundColor: customStyles?.container?.backgroundColor,
                color: customStyles?.title?.color,
                border: `1px solid ${customStyles?.border?.color || 'rgba(0, 0, 0, 0.1)'}`,
                transition: 'all 0.2s ease',
              },
              submitButton: {
                backgroundColor: customStyles?.brand?.color || customStyles?.title?.color,
                color: customStyles?.container?.backgroundColor,
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              },
            }}
          />
        </div>

        {/* Right Column - Generated Results */}
        <div className="space-y-4 lg:col-span-2">
          {images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square group">
                  <img 
                    src={image.image} 
                    alt={`Generated ${index + 1}`} 
                    className="rounded-lg object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[calc(100vh-12rem)] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Cinematic", prompt: "cinematic lighting, dramatic shadows, film grain" },
                  { name: "Watercolor", prompt: "watercolor painting style, soft edges, flowing colors" },
                  { name: "Pixel Art", prompt: "8-bit pixel art style, retro gaming aesthetic" },
                  { name: "Sketch", prompt: "hand-drawn sketch style, pencil lines, artistic" },
                  { name: "Oil Painting", prompt: "oil painting style, rich textures, classical art" },
                  { name: "Anime", prompt: "anime style, vibrant colors, expressive features" },
                  { name: "Cyberpunk", prompt: "cyberpunk style, neon lights, futuristic" },
                  { name: "Minimalist", prompt: "minimalist style, clean lines, simple shapes" },
                  { name: "Vintage", prompt: "vintage style, retro colors, aged look" },
                  { name: "Abstract", prompt: "abstract art style, geometric shapes, bold colors" },
                  { name: "Pop Art", prompt: "pop art style, bold colors, comic book aesthetic" },
                  { name: "Gothic", prompt: "gothic style, dark atmosphere, dramatic lighting" },
                ].map((style, index) => (
                  <div 
                    key={index}
                    className="relative aspect-square group cursor-pointer"
                    onClick={() => handlePromptSubmit(style.prompt)}
                  >
                    <div 
                      className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5"
                      style={{
                        backgroundColor: customStyles?.container?.backgroundColor,
                        border: `1px solid ${customStyles?.border?.color || 'rgba(0, 0, 0, 0.1)'}`,
                      }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-4 text-center">
                      <h3 
                        className="text-base sm:text-lg font-medium mb-1"
                        style={{ color: customStyles?.title?.color }}
                      >
                        {style.name}
                      </h3>
                      <p 
                        className="text-xs sm:text-sm opacity-60 line-clamp-2"
                        style={{ color: customStyles?.title?.color }}
                      >
                        {style.prompt}
                      </p>
                    </div>
                    <div 
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
                      style={{ color: customStyles?.container?.backgroundColor }}
                    >
                      <span className="text-xs sm:text-sm font-medium">Click to apply style</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 