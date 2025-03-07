import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IUser } from '../users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import mongoose, { Model, Types } from 'mongoose';
import aqp from 'api-query-params';
import { Category } from '../categories/schemas/category.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Category.name) private categoryModel: Model<Category>
  ) { }

  async create(createProductDto: CreateProductDto, user: IUser) {
    const { title, description, price,
      discountPercentage, categoryId,
      status, images, versions,
      chip, ram, ssd, gpu, thumbnail, cost } = createProductDto;

    const product = await this.productModel.create({
      title, description, price,
      discountPercentage,
      images, status, versions, categoryId,
      chip, ram, ssd, gpu, thumbnail, cost,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return product;
  }

  async findAll(current: number, pageSize: number, query) {
    const { sort } = aqp(query);

    let filter: any = {
      isDeleted: false
    };

    // get products according to the category
    if (query.categorySlug) {
      const categorySlug = query.categorySlug;
      const categories = await this.categoryModel.find();
      const categoryId = categories.find(item => item.slug === categorySlug)._id.toString();
      if (!categoryId)
        throw new BadRequestException("not product found");

      const queue = [categoryId];
      const allIds = [categoryId];
      while (queue.length > 0) {
        const currentIds = queue.splice(0, queue.length);
        const children = categories.filter(item => currentIds.includes(item.parentId));

        if (children.length > 0) {
          const childrenId = children.map(item => item._id.toString());
          queue.push(...childrenId);
          allIds.push(...childrenId);
        }
      }
      filter.categoryId = { $in: allIds }
    }
    if (query.chip) {
      const chipList = query.chip.split(',');
      filter.chip = { $in: chipList }
    }
    if (query.ram) {
      const ramList = query.ram.split(',');
      filter.ram = { $in: ramList }
    }
    if (query.ssd) {
      const ssdList = query.ssd.split(',');
      filter.ssd = { $in: ssdList }
    }
    if (query.price) {
      const priceRange = query.price.split(',');
      filter.price = {
        $gte: priceRange[0],
        $lte: priceRange[1]
      }
    }
    if (query.slug) {
      filter.slug = new RegExp(query.slug, "i");
    }
    let currentDefault = current ? current : 1;
    let limitDefault = pageSize ? pageSize : 10;

    const totalItems = await this.productModel.countDocuments(filter);
    const totalPage = Math.ceil(totalItems / limitDefault);

    let skip = (currentDefault - 1) * limitDefault;

    const result = await this.productModel
      .find(filter)
      .skip(skip)
      .limit(limitDefault)
      .sort(sort as any)
      .populate({ path: "categoryId", select: { title: 1 } })
      .exec();

    return {
      meta: {
        current: currentDefault,
        pageSize: limitDefault,
        totalItems: totalItems,
        pages: totalPage
      },
      result: result
    };
  }

  async findOne(idOrSlug: string) {
    let result;
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      result = await this.productModel.findOne({
        _id: idOrSlug,
        isDeleted: false
      }).populate({ path: "categoryId", select: { title: 1 } });
    } else {
      result = await this.productModel.findOne({
        slug: idOrSlug,
        isDeleted: false
      }).populate({ path: "categoryId", select: { title: 1 } });
    }
    if (!result)
      throw new BadRequestException("Get information failed");

    return result;
  }

  async getRelatedProducts(slug: string) {
    const product = await this.productModel.findOne({
      slug: slug
    });

    if (!product)
      return [];

    const categoryId = product.categoryId;

    const relateProducts = await this.productModel.find({
      categoryId: categoryId,
      _id: { $nin: product._id }
    }).limit(4);

    return relateProducts;
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException("id product không hợp lệ")

    const result = await this.productModel.updateOne({
      _id: id,
      isDeleted: false
    }, {
      ...updateProductDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    });

    return result;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException("id product không hợp lệ")

    const result = await this.productModel.updateOne({
      _id: id,
    }, {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    });
    return result;
  }

  async removeMultiple(ids: string[], user: IUser) {
    const result = await this.productModel.updateMany({ _id: { $in: ids } }, {
      isDeleted: true,
      deletedAt: new Date,
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    });

    return result;
  }

  async getTopSellingAndLowQuantity() {
    const products = await this.productModel.find();
    const topSelling = products.sort((a, b) => b.sold - a.sold).slice(0, 5);
    const lowQuantity = products.sort((a, b) =>
      a.versions.reduce((prev, cur) => prev + cur.quantity, 0)
      - b.versions.reduce((prev, cur) => prev + cur.quantity, 0)
    ).slice(0, 5)
      .filter(item => {
        const check = item.versions.reduce((prev, cur) => prev + cur.quantity, 0) < 20;
        return check;
      });
    return {
      topSelling,
      lowQuantity
    }
  }
}
