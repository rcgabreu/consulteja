function ProductCard({ product }) {
  try {
    const categoryColors = {
      maquiagem: 'var(--accent-pink)',
      pele: 'var(--accent-green)',
      cabelo: 'var(--accent-purple)'
    };

    const bgColor = categoryColors[product.category] || 'var(--primary-color)';

    return (
      <div className="product-card" data-name="product-card" data-file="components/ProductCard.js">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            ) : (
              <div className="w-full h-64 rounded-lg flex items-center justify-center" style={{backgroundColor: bgColor, opacity: 0.2}}>
                <div className="icon-package text-6xl text-white"></div>
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold text-white" style={{backgroundColor: bgColor}}>
                {product.categoryName}
              </span>
            </div>
            
            <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <div className="icon-barcode text-xl" style={{color: bgColor}}></div>
                <span className="text-[var(--text-light)]">Código: {product.barcode}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="icon-tag text-xl" style={{color: bgColor}}></div>
                <span className="text-[var(--text-light)]">Marca: {product.brand}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="icon-dollar-sign text-xl" style={{color: bgColor}}></div>
                <span className="text-2xl font-bold" style={{color: bgColor}}>R$ {product.price}</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2">Descrição</h3>
              <p className="text-[var(--text-light)]">{product.description}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`icon-${product.inStock ? 'check-circle' : 'x-circle'} text-xl`} 
                   style={{color: product.inStock ? 'var(--accent-green)' : '#FF6B6B'}}></div>
              <span className={product.inStock ? 'text-green-600' : 'text-red-600'}>
                {product.inStock ? 'Em estoque' : 'Fora de estoque'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ProductCard component error:', error);
    return null;
  }
}