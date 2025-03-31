import { CACHE, ERROR_MESSAGES } from "@/constants";
import { unstable_cache } from "next/cache";
import { connectToDatabase } from "..";
import { Id } from "@/types";
import { NotFoundError } from "@/lib/error";
import Coupon from "../model/coupon.model";
import { couponTypeSchema } from "@/features/coupons/coupon.validator";
import {
  CouponInputType,
  CouponUpdateType,
} from "@/features/coupons/coupon.types";

const getCouponById = async (id: Id) => {
  await connectToDatabase();
  const result = await Coupon.findById(id).lean();
  const tag = couponTypeSchema.parse(result);
  return tag;
};

const getCouponByCode = async (code: string) => {
  await connectToDatabase();
  const result = await Coupon.findOne({ code }).lean();
  if (!result) return null;

  const tag = couponTypeSchema.parse(result);
  return tag;
};

const getAllCoupons = unstable_cache(
  async () => {
    await connectToDatabase();
    const result = await Coupon.find().lean();
    const coupons = result.map((coupon) => couponTypeSchema.parse(coupon));

    return coupons;
  },
  CACHE.COUPONS.ALL.KEY_PARTS,
  {
    tags: [CACHE.COUPONS.ALL.TAGS],
    revalidate: 3600,
  },
);

const createCoupon = async (tag: CouponInputType) => {
  await connectToDatabase();
  const result = await Coupon.create(tag);

  return result._id.toString();
};

const updateCoupon = async (input: CouponUpdateType) => {
  await connectToDatabase();

  const result = await Coupon.findOneAndUpdate({ _id: input.id }, input);
  if (!result) {
    throw new NotFoundError({
      resource: "coupon",
      message: ERROR_MESSAGES.COUPON.NOT_FOUND,
    });
  }
};
const deleteCoupon = async (ids: string | string[]) => {
  await connectToDatabase();
  const idsArray = Array.isArray(ids) ? ids : [ids];

  const count = await Coupon.countDocuments({ _id: { $in: idsArray } });

  if (count !== idsArray.length) {
    throw new NotFoundError({
      resource: "tag",
      message: ERROR_MESSAGES.TAG.NOT_FOUND,
    });
  }

  await Coupon.deleteMany({ _id: { $in: idsArray } });
  return ids;
};
const couponsRepository = {
  getCouponById,
  getCouponByCode,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};

export default couponsRepository;
