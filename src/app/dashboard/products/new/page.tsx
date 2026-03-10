import { ProductForm } from '@/components/ProductForm';

export default function NewProductPage() {
    return (
        <div className="container mx-auto py-10 p-2">
            <h1 className="max-w-4xl text-3xl font-bold mb-6 mx-auto">Создание карточки товара</h1>
            <ProductForm />
        </div>
    );
}