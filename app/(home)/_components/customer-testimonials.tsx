import { Quote } from "lucide-react";
import Image from "next/image";
import { Heading } from "./heading";

const testimonials = [
  {
    image: "/home/customer-testimonials-1.jpeg",
    title: "Thiết kế thời trang, đeo lên là thấy khác biệt hoàn toàn",
    comment:
      "Kính rất đẹp, đeo lên vừa vặn và tôn khuôn mặt. Mình rất hài lòng vì chất lượng và phong cách đều vượt mong đợi.",
    name: "Minh Anh – Nhân viên văn phòng",
  },
  {
    image: "/home/customer-testimonials-2.jpeg",
    title: "Dịch vụ tận tâm, kính chắc chắn và giao hàng cực nhanh",
    comment:
      "Từ khâu tư vấn đến lúc nhận kính đều rất chuyên nghiệp. Gọng kính bền, nhẹ và cảm giác đeo cực kỳ thoải mái cả ngày dài.",
    name: "Quang Huy – Nhiếp ảnh gia",
  },
  {
    image: "/home/customer-testimonials-3.jpeg",
    title: "Lần đầu mua kính online và trải nghiệm thật sự hài lòng",
    comment:
      "Không nghĩ mua kính online lại dễ dàng và ưng ý đến vậy. Kính đẹp, chất lượng tốt, giá lại rất hợp lý và được đo mắt miễn phí.",
    name: "Ngọc Trâm – Sinh viên",
  },
];

export const CustomerTestimonials = () => {
  return (
    <div className="container">
      <h2 className="text-primary text-center font-bold text-4xl">
        Khách hàng nói về chúng tôi
      </h2>
      {/* <Heading */}
      {/*   className="text-center mx-auto" */}
      {/*   title="Khách hàng nói về chúng tôi" */}
      {/* /> */}
      <ul className="grid gap-12 mt-8 md:max-w-[700px] mx-auto">
        {testimonials.map((testimonial, index) => (
          <li
            key={index}
            className="flex justify-between gap-8 flex-col md:flex-row md:even:flex-row-reverse"
          >
            <Image
              className="w-full aspect-[18/9] object-center object-cover md:aspect-square md:w-[200px]"
              src={testimonial.image}
              alt="Customer testimonials"
              width={640}
              height={640}
            />
            <div className="grid grid-cols-[1fr_auto] md:grid-rows-[auto_auto_auto]">
              <p className="text-primary text-xl md:row-start-1">
                {testimonial.title}
              </p>
              <p className=" col-span-2 md:col-span-1 md:row-start-2">
                {testimonial.comment}
              </p>
              <p className=" text-primary italic md:row-start-3">
                {testimonial.name}
              </p>
              <div className="row-start-1 col-start-2 md:row-span-3">
                <Quote className="text-primary size-8 md:size-20 fill-primary" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
