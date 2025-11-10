class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-light)]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Algo deu errado</h1>
            <p className="text-[var(--text-light)] mb-4">Desculpe, algo inesperado aconteceu.</p>
            <button onClick={() => window.location.reload()} className="btn-primary">
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  try {
    const [scannedProduct, setScannedProduct] = React.useState(null);
    const [registeringBarcode, setRegisteringBarcode] = React.useState(null);

    const handleScanSuccess = (product) => {
      setScannedProduct(product);
      setRegisteringBarcode(null);
    };

    const handleProductNotFound = (barcode) => {
      setRegisteringBarcode(barcode);
      setScannedProduct(null);
    };

    const handleRegistrationComplete = (product) => {
      setScannedProduct(product);
      setRegisteringBarcode(null);
    };

    const handleReset = () => {
      setScannedProduct(null);
      setRegisteringBarcode(null);
    };

    return (
      <div className="min-h-screen" data-name="app" data-file="app.js">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {!scannedProduct && !registeringBarcode && (
            <BarcodeScanner 
              onScanSuccess={handleScanSuccess} 
              onProductNotFound={handleProductNotFound}
            />
          )}
          
          {registeringBarcode && (
            <ProductRegistration 
              barcode={registeringBarcode}
              onComplete={handleRegistrationComplete}
              onCancel={handleReset}
            />
          )}
          
          {scannedProduct && (
            <ProductView product={scannedProduct} onReset={handleReset} />
          )}
        </main>
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

function ProductView({ product, onReset }) {
  return (
    <div data-name="product-view" data-file="app.js">
      <button onClick={onReset} className="mb-6 flex items-center gap-2 text-[var(--text-light)] hover:text-[var(--text-dark)]">
        <div className="icon-arrow-left text-xl"></div>
        <span>Escanear Outro Produto</span>
      </button>
      <ProductCard product={product} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);