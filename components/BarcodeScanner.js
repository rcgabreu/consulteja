function BarcodeScanner({ onScanSuccess, onProductNotFound }) {
  try {
    const [scanning, setScanning] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [manualBarcode, setManualBarcode] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const scannerRef = React.useRef(null);

    const handleManualSearch = async () => {
      if (!manualBarcode.trim()) {
        setError('Por favor, digite um código de barras válido');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const product = await searchProductByBarcode(manualBarcode.trim());
        if (product) {
          onScanSuccess(product);
        } else {
          onProductNotFound(manualBarcode.trim());
        }
      } catch (err) {
        setError('Erro ao buscar produto. Tente novamente.');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleManualSearch();
      }
    };

    const startScanner = () => {
      setScanning(true);
      setError(null);

      Quagga.init({
        inputStream: {
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            width: 640,
            height: 480,
            facingMode: "environment"
          }
        },
        decoder: {
          readers: ["ean_reader", "ean_8_reader", "code_128_reader", "code_39_reader"]
        }
      }, (err) => {
        if (err) {
          console.error(err);
          setError('Erro ao iniciar câmera. Verifique as permissões.');
          setScanning(false);
          return;
        }
        Quagga.start();
      });

      Quagga.onDetected(async (data) => {
        const barcode = data.codeResult.code;
        Quagga.stop();
        setScanning(false);
        setLoading(true);
        
        try {
          const product = await searchProductByBarcode(barcode);
          if (product) {
            onScanSuccess(product);
          } else {
            onProductNotFound(barcode);
          }
        } catch (err) {
          setError('Erro ao buscar produto');
        } finally {
          setLoading(false);
        }
      });
    };

    const stopScanner = () => {
      Quagga.stop();
      setScanning(false);
    };

    React.useEffect(() => {
      return () => {
        if (scanning) {
          Quagga.stop();
        }
      };
    }, []);

    return (
      <div data-name="barcode-scanner" data-file="components/BarcodeScanner.js">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center">Consulta de Produtos</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
              <div className="icon-alert-circle text-xl"></div>
              <span>{error}</span>
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Digite o Código de Barras</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ex: 7891234567890"
                className="flex-1 px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-[var(--primary-color)]"
                disabled={loading || scanning}
              />
              <button 
                onClick={handleManualSearch} 
                className="btn-primary"
                disabled={loading || scanning}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="icon-loader text-xl animate-spin"></div>
                    <span>Buscando...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="icon-search text-xl"></div>
                    <span>Buscar</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          <div className="border-t pt-8 mb-6">
            <h3 className="text-lg font-bold mb-4 text-center">Ou Use a Câmera/Leitor USB</h3>
            <div ref={scannerRef} className="mb-6 rounded-lg overflow-hidden bg-gray-100" style={{minHeight: '400px'}}></div>
          </div>

          <div className="flex gap-4 justify-center">
            {!scanning ? (
              <button onClick={startScanner} className="btn-primary">
                <div className="flex items-center gap-2">
                  <div className="icon-camera text-xl"></div>
                  <span>Iniciar Scanner</span>
                </div>
              </button>
            ) : (
              <button onClick={stopScanner} className="btn-primary" style={{backgroundColor: '#FF6B6B'}}>
                <div className="flex items-center gap-2">
                  <div className="icon-x text-xl"></div>
                  <span>Parar Scanner</span>
                </div>
              </button>
            )}
          </div>

          <div className="mt-8 p-4 bg-[var(--bg-light)] rounded-lg">
            <h3 className="font-bold mb-2">Instruções:</h3>
            <ul className="list-disc list-inside space-y-1 text-[var(--text-light)]">
              <li>Clique em "Iniciar Scanner" para ativar o leitor</li>
              <li>Conecte seu leitor de código de barras USB ao computador</li>
              <li>Escaneie o código de barras do produto com o leitor</li>
              <li>Ou posicione o código de barras na frente da câmera</li>
              <li>O produto será detectado automaticamente</li>
            </ul>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('BarcodeScanner component error:', error);
    return null;
  }
}