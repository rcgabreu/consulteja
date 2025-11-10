function Header() {
  try {
    return (
      <header className="bg-white shadow-md" data-name="header" data-file="components/Header.js">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor: 'var(--primary-color)'}}>
                <div className="icon-scan text-2xl text-white"></div>
              </div>
              <h1 className="text-2xl font-bold" style={{color: 'var(--primary-color)'}}>Consulte Já</h1>
            </div>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}
