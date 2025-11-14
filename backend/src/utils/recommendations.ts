import { Product } from '@/models';
import { IProductDocument } from '@/models/Product';

interface RecommendationOptions {
  limit?: number;
  priceTolerance?: number;
}

export const getRecommendations = async (
  productId: string,
  options: RecommendationOptions = {}
): Promise<IProductDocument[]> => {
  const { limit = 10, priceTolerance = 0.3 } = options;

  const product = await Product.findById(productId);
  if (!product) {
    return [];
  }

  const priceMin = product.price * (1 - priceTolerance);
  const priceMax = product.price * (1 + priceTolerance);

  const recommendations = await Product.aggregate([
    {
      $match: {
        _id: { $ne: product._id },
        isActive: true,
        $or: [
          { category: product.category },
          { brand: product.brand },
          {
            price: {
              $gte: priceMin,
              $lte: priceMax,
            },
          },
          ...(product.tags && product.tags.length > 0
            ? [{ tags: { $in: product.tags } }]
            : []),
        ],
      },
    },
    {
      $addFields: {
        score: {
          $add: [
            { $cond: [{ $eq: ['$category', product.category] }, 3, 0] },
            { $cond: [{ $eq: ['$brand', product.brand] }, 2, 0] },
            {
              $cond: [
                {
                  $and: [
                    { $gte: ['$price', priceMin] },
                    { $lte: ['$price', priceMax] },
                  ],
                },
                1,
                0,
              ],
            },
            {
              $size: {
                $ifNull: [
                  {
                    $setIntersection: [
                      { $ifNull: ['$tags', []] },
                      product.tags || [],
                    ],
                  },
                  [],
                ],
              },
            },
          ],
        },
      },
    },
    { $sort: { score: -1, createdAt: -1 } },
    { $limit: limit },
  ]);

  return recommendations as IProductDocument[];
};

export const getRelatedByCategory = async (
  category: string,
  excludeId?: string,
  limit: number = 10
): Promise<IProductDocument[]> => {
  const query: any = {
    category,
    isActive: true,
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  return Product.find(query).limit(limit).sort({ createdAt: -1 });
};

export const getRelatedByTags = async (
  tags: string[],
  excludeId?: string,
  limit: number = 10
): Promise<IProductDocument[]> => {
  if (!tags || tags.length === 0) {
    return [];
  }

  const query: any = {
    tags: { $in: tags },
    isActive: true,
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  return Product.find(query).limit(limit).sort({ createdAt: -1 });
};

export const getRelatedByPriceRange = async (
  price: number,
  tolerance: number = 0.3,
  excludeId?: string,
  limit: number = 10
): Promise<IProductDocument[]> => {
  const minPrice = price * (1 - tolerance);
  const maxPrice = price * (1 + tolerance);

  const query: any = {
    price: { $gte: minPrice, $lte: maxPrice },
    isActive: true,
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  return Product.find(query).limit(limit).sort({ createdAt: -1 });
};
