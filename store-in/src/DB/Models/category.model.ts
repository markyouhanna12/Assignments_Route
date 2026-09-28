import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Category {
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
  })
  name!: string;

  @Prop({
    type: String,
    required: true,
  })
  logo!: string;

  @Prop({
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  createdBy!: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isDeleted!: boolean;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'User',
  })
  deletedBy?: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

export type HCategoryDocument = HydratedDocument<Category>;

export const CategoryModel = MongooseModule.forFeature([
  {
    name: 'Category',
    schema: CategorySchema,
  },
]);
