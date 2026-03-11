const API_BASE_URL = 'https://app.tablecrm.com/api/v1';
const TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

export interface ProductPayload {
    name: string;
    type: 'product';
    description_short: string;
    description_long: string;
    code: string;
    unit: number;
    category: number;
    cashback_type: 'lcard_cashback';
    seo_title: string;
    seo_description: string;
    seo_keywords: string[];
    global_category_id: number;
    marketplace_price: number;
    chatting_percent: number;
    address: string;
    latitude: number;
    longitude: number;
}

export interface Category {
    id: number;
    name: string;
}

export async function createProduct(product: ProductPayload) {
    const response = await fetch(`${API_BASE_URL}/nomenclature/?token=${TOKEN}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify([product]),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка ${response.status}: ${errorText}`);
    }

    return response.json();
}


export async function fetchCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories/?limit=500&token=${TOKEN}`);
    if (!response.ok) {
        throw new Error(`Ошибка загрузки категорий: ${response.status}`);
    }
    const data = await response.json();
    return data.result || [];
}