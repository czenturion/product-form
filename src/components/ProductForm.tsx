'use client';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createProduct, ProductPayload, fetchCategories, type Category } from '@/lib/api';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const formSchema = z.object({
    name: z.string().min(1, 'Название обязательно'),
    code: z.string().optional(),
    description_short: z.string().optional(),
    description_long: z.string().optional(),

    category: z.string().min(1, 'Выберите категорию'),
    unit: z.string().min(1, 'Выберите единицу измерения'),

    marketplace_price: z.coerce.number().min(0, 'Цена не может быть отрицательной'),
    chatting_percent: z.coerce.number().min(0).max(100, 'Процент от 0 до 100'),

    seo_title: z.string().optional(),
    seo_description: z.string().optional(),
    seo_keywords: z.string().optional(),

    address: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const categories = [
    { id: 2477, name: 'Электроника' },
    { id: 2478, name: 'Одежда' },
    { id: 2479, name: 'Дом и сад' },
];

const units = [
    { id: 116, name: 'шт' },
    { id: 117, name: 'кг' },
    { id: 118, name: 'л' },
];

const resolver = zodResolver(formSchema) as Resolver<FormValues>;

export function ProductForm() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCategories()
            .then(setCategories)
            .catch(err => {
                console.error('Failed to load categories:', err);
                toast.error('Не удалось загрузить список категорий');
            })
            .finally(() => setLoadingCategories(false));
    }, []);

    const uniqueCategories = Array.from(
        new Map(categories.map(cat => [cat.name, cat])).values()
    );

    const filteredCategories = uniqueCategories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const form = useForm<FormValues>({
        resolver,
        defaultValues: {
            name: '',
            code: '',
            description_short: '',
            description_long: '',
            category: '',
            unit: '',
            marketplace_price: 0,
            chatting_percent: 0,
            seo_title: '',
            seo_description: '',
            seo_keywords: '',
            address: '',
            latitude: undefined,
            longitude: undefined,
        },
    });

    async function onSubmit(data: FormValues) {
        setIsSubmitting(true);

        try {
            const seoKeywordsArray = data.seo_keywords
                ? data.seo_keywords.split(',').map(k => k.trim()).filter(Boolean)
                : [];


            const payload: ProductPayload = {
                name: data.name,
                type: 'product',
                description_short: data.description_short || '',
                description_long: data.description_long || '',
                code: data.code || '',
                unit: parseInt(data.unit),
                category: parseInt(data.category),
                cashback_type: 'lcard_cashback',
                seo_title: data.seo_title || '',
                seo_description: data.seo_description || '',
                seo_keywords: seoKeywordsArray,
                global_category_id: 127,
                marketplace_price: data.marketplace_price,
                chatting_percent: data.chatting_percent,
                address: data.address || '',
                latitude: data.latitude || 0,
                longitude: data.longitude || 0,
            };

            const result = await createProduct(payload);
            toast.success('Товар успешно создан!')
            form.reset();
        } catch (err) {
            console.error('Ошибка: ', err)
            toast.error(err instanceof Error ? err.message : 'Неизвестная ошибка');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Новый товар</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium border-b pb-2">Основная информация</h3>

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Название товара *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Например, Кофеварка Bork" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Артикул</FormLabel>
                                            <FormControl>
                                                <Input placeholder="CV-101" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Категория *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Выберите категорию" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent
                                                    position="popper"
                                                    side="bottom"
                                                    align="start"
                                                    className="w-[var(--radix-select-trigger-width)]"
                                                    sideOffset={5}
                                                >
                                                    <div className="p-2">
                                                        <Input
                                                            placeholder="Поиск категории..."
                                                            value={searchTerm}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                setSearchTerm(e.target.value);
                                                            }}
                                                            onClick={(e) => e.stopPropagation()}
                                                            onKeyDown={(e) => e.stopPropagation()}
                                                        />
                                                    </div>
                                                    {filteredCategories.map(cat => (
                                                        <SelectItem key={cat.id} value={cat.id.toString()}>
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="unit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Единица измерения *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Выберите единицу" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {units.map(u => (
                                                        <SelectItem key={u.id} value={u.id.toString()}>
                                                            {u.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="marketplace_price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Цена на маркетплейсе *</FormLabel>
                                            <FormControl>
                                                <Input type="number" min="0" step="0.01" placeholder="12500" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description_short"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Краткое описание</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Краткое описание для карточки в каталоге"
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description_long"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Полное описание</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Подробное описание товара"
                                                className="min-h-32"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium border-b pb-2">Финансы и комиссии</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="chatting_percent"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Процент за общение (%)</FormLabel>
                                            <FormControl>
                                                <Input type="number" min="0" max="100" step="1" placeholder="4" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium border-b pb-2">SEO-параметры</h3>

                            <FormField
                                control={form.control}
                                name="seo_title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SEO заголовок</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Купить кофеварку Bork" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="seo_description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SEO описание</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Лучшая цена на кофеварки" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="seo_keywords"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ключевые слова (через запятую)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="кофеварка, bork, эспрессо" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium border-b pb-2">Адрес и местоположение</h3>

                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Адрес</FormLabel>
                                        <FormControl>
                                            <Input placeholder="ул. Зайцева, 8" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="latitude"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Широта</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="any" placeholder="55.7711953" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="longitude"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Долгота</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="any" placeholder="49.1021179" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                            {isSubmitting ? 'Создание...' : 'Создать товар'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}