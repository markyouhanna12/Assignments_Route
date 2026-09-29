import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Product {
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
  })
  name!: string;

  @Prop([
    {
      type: String,
      required: true,
    },
  ])
  images!: string[];

  @Prop({
    type: Number,
    required: true,
  })
  price!: number;

  @Prop({
    type: Number,
    required: true,
  })
  stock!: number;

  @Prop({
    type: String,
  })
  overview!: string;

  @Prop({
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  createdBy!: string;

  @Prop({
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Category',
  })
  category!: string;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'Brand',
  })
  brand!: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isDeleted!: boolean;

  @Prop({
    type: Date,
    default: null,
  })
  deletedAt?: Date | null;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'User',
    default: null,
  })
  deletedBy?: string | null;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

export type HProductDocument = HydratedDocument<Product>;

export const ProductModel = MongooseModule.forFeature([
  {
    name: 'Product',
    schema: ProductSchema,
  },
]);
