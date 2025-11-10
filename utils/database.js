// =======================
// Banco de dados local de produtos alimentícios
// =======================
const productsDatabase = [
  {
    id: 1,
    barcode: "7891000055123",
    name: "Arroz Tio João Tipo 1",
    brand: "Tio João",
    category: "graos",
    categoryName: "Grãos e Cereais",
    price: "8.99",
    description: "Arroz branco tipo 1, grãos selecionados e soltinhos.",
    inStock: true
  },
  {
    id: 2,
    barcode: "7894900011517",
    name: "Feijão Carioca Kicaldo",
    brand: "Kicaldo",
    category: "graos",
    categoryName: "Grãos e Cereais",
    price: "9.50",
    description: "Feijão carioca tipo 1, ideal para o dia a dia.",
    inStock: true
  },
  {
    id: 3,
    barcode: "7896004001005",
    name: "Café Maratá Tradicional 250g",
    brand: "Maratá",
    category: "bebidas",
    categoryName: "Bebidas",
    price: "12.90",
    description: "Café torrado e moído com aroma intenso e sabor marcante.",
    inStock: true
  },
  {
    id: 4,
    barcode: "7898215150154",
    name: "Leite Integral Italac 1L",
    brand: "Italac",
    category: "laticinios",
    categoryName: "Laticínios",
    price: "5.49",
    description: "Leite UHT integral pronto para consumo.",
    inStock: true
  },
  {
    id: 5,
    barcode: "7891098046363",
    name: "Biscoito Recheado Bono Chocolate",
    brand: "Nestlé",
    category: "biscoitos",
    categoryName: "Biscoitos e Snacks",
    price: "4.29",
    description: "Biscoito crocante recheado com sabor chocolate.",
    inStock: true
  }
];

// =======================
// Categorias
// =======================
const categories = [
  {
    id: "graos",
    name: "Grãos e Cereais",
    description: "Arroz, feijão, milho e outros grãos",
    productCount: 2
  },
  {
    id: "laticinios",
    name: "Laticínios",
    description: "Leites, queijos e derivados",
    productCount: 1
  },
  {
    id: "biscoitos",
    name: "Biscoitos e Snacks",
    description: "Biscoitos doces e salgados",
    productCount: 1
  },
  {
    id: "bebidas",
    name: "Bebidas",
    description: "Cafés, sucos e refrigerantes",
    productCount: 1
  }
];

// =======================
// Funções principais
// =======================

function findProductByBarcode(barcode) {
  return productsDatabase.find(product => product.barcode === barcode);
}

function getCategories() {
  return categories;
}

function getProductsByCategory(categoryId) {
  return productsDatabase.filter(product => product.category === categoryId);
}

// =======================
// Busca produto pela API Open Food Facts
// =======================
async function searchProductByBarcode(barcode) {
  try {
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = await response.json();

    // Se encontrou o produto na API
    if (data.status === 1 && data.product) {
      const apiProduct = data.product;

      return {
        id: barcode,
        barcode: barcode,
        name: apiProduct.product_name || "Produto alimentício sem nome",
        brand: apiProduct.brands || "Marca desconhecida",
        category: "alimentos",
        categoryName: "Alimentos em Geral",
        price: "Consultar loja",
        description: apiProduct.generic_name ||
                     apiProduct.ingredients_text ||
                     "Informações nutricionais não disponíveis",
        image: apiProduct.image_url || apiProduct.image_front_url || null,
        inStock: true
      };
    }

    // Se não encontrar na API, procura no banco local
    const localProduct = findProductByBarcode(barcode);
    if (localProduct) {
      return localProduct;
    }

    // Se não encontrar em lugar nenhum
    return null;

  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    const localProduct = findProductByBarcode(barcode);
    return localProduct || null;
  }
}

// =======================
// Cadastro manual de novo produto
// =======================
async function registerNewProduct(barcode, formData) {
  const categoryNames = {
    "graos": "Grãos e Cereais",
    "laticinios": "Laticínios",
    "biscoitos": "Biscoitos e Snacks",
    "bebidas": "Bebidas",
    "alimentos": "Alimentos em Geral"
  };

  const newProduct = {
    id: productsDatabase.length + 1,
    barcode: barcode,
    name: formData.name,
    brand: formData.brand,
    category: formData.category,
    categoryName: categoryNames[formData.category] || "Outros",
    price: formData.price,
    description: formData.description || "Sem descrição",
    image: formData.imageUrl || null,
    inStock: true
  };

  productsDatabase.push(newProduct);
  return newProduct;
}

// =======================
// Exemplo de uso com leitor de barras
// =======================
// (Simulação — substitua o 'prompt' pelo input real do leitor)
async function simulateBarcodeScan(barcode) {
  console.log(`🔍 Procurando produto com código: ${barcode}...`);
  const product = await searchProductByBarcode(barcode);

  if (product) {
    console.log("✅ Produto encontrado:", product);
  } else {
    console.log("⚠️ Produto não encontrado. Cadastre manualmente.");
  }
}

// Exemplo de teste:
simulateBarcodeScan("7891000055123"); // Produto local
// simulateBarcodeScan("3017620429484"); // Produto real da API (Nutella)
