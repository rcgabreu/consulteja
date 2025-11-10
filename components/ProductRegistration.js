function ProductRegistration({ barcode, onComplete, onCancel }) {
  try {
    const [formData, setFormData] = React.useState({
      name: '',
      brand: '',
      price: '',
      description: '',
      category: 'comida',
      imageUrl: ''
    });
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState(null);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!formData.name || !formData.brand || !formData.price) {
        setError('Por favor, preencha os campos obrigatórios (nome, marca e preço)');
        return;
      }

      setSaving(true);
      setError(null);

      try {
        const newProduct = await registerNewProduct(barcode, formData);
        onComplete(newProduct);
      } catch (err) {
        setError('Erro ao cadastrar produto. Tente novamente.');
        console.error('Registration error:', err);
      } finally {
        setSaving(false);
      }
    };

    const categoryOptions = [
      { value: 'grãos', label: 'Grãos' },
      { value: 'bebida', label: 'Bebidas' },
      { value: 'frutos do mar', label: 'Frutos do Mar' },
      { value: 'snack', label: 'Doces e Sobremesas' }
    ];

    return (
      <div data-name="product-registration" data-file="components/ProductRegistration.js">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Produto Não Encontrado</h2>
            <p className="text-[var(--text-light)]">
              O código de barras <strong>{barcode}</strong> não foi encontrado. 
              Cadastre o produto abaixo:
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
              <div className="icon-alert-circle text-xl"></div>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Nome do Produto <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Tapioca Jatobá"
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-[var(--primary-color)]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Marca <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Ex: Lisa"
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-[var(--primary-color)]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Preço (R$) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Ex: 45.90"
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-[var(--primary-color)]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Categoria</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-[var(--primary-color)]"
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Descrição</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descreva o produto..."
                rows="4"
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-[var(--primary-color)]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">URL da Imagem (opcional)</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://exemplo.com/imagem.jpg"
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-[var(--primary-color)]"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="icon-loader text-xl animate-spin"></div>
                    <span>Cadastrando...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <div className="icon-check text-xl"></div>
                    <span>Cadastrar Produto</span>
                  </div>
                )}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 hover:bg-gray-50 transition-all"
                disabled={saving}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ProductRegistration component error:', error);
    return null;
  }
}