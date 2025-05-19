import { SupportPagesHeading } from "./heading";

export const AboutUsDefaultPage = () => {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 space-y-12">
      <section className="text-center">
        <SupportPagesHeading>Về chúng tôi</SupportPagesHeading>
        <p className="text-lg text-gray-700">
          Chúng tôi là Hồng Anh – cửa hàng kính mắt uy tín chuyên cung cấp kính
          thời trang, kính cận, kính râm chất lượng cao cho mọi lứa tuổi.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">Câu chuyện thương hiệu</h2>
        <p className="text-gray-700">
          Từ một tiệm kính nhỏ, Hồng Anh được thành lập với mong muốn mang lại
          trải nghiệm đeo kính tốt nhất cho người Việt. Chúng tôi không ngừng
          cải tiến chất lượng sản phẩm và dịch vụ để phục vụ bạn tốt hơn mỗi
          ngày.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">Sứ mệnh & Giá trị</h2>
        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>Chất lượng sản phẩm là ưu tiên hàng đầu</li>
          <li>Dịch vụ tận tâm, đo mắt miễn phí</li>
          <li>Phong cách thời trang, phù hợp mọi độ tuổi</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">Đội ngũ của chúng tôi</h2>
        <p className="text-gray-700">
          Đội ngũ Hồng Anh gồm các chuyên viên thị lực và nhân viên tư vấn tận
          tâm, am hiểu về thời trang và công nghệ kính, luôn sẵn sàng phục vụ
          bạn.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">Tại sao chọn Hồng Anh?</h2>
        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>Miễn phí đo mắt, kiểm tra thị lực chuyên nghiệp</li>
          <li>Giao hàng toàn quốc, đổi trả dễ dàng</li>
          <li>Giá cả minh bạch, bảo hành rõ ràng</li>
        </ul>
      </section>

      {/* <section className="text-center pt-8 border-t"> */}
      {/*   <p className="text-gray-700 mb-2"> */}
      {/*     📍 123 Đường ABC, Quận XYZ, TP. HCM */}
      {/*   </p> */}
      {/*   <p className="text-gray-700 mb-4">📞 Hotline: 0909 123 456</p> */}
      {/*   <Link */}
      {/*     href={ENDPOINTS.SUPPORT.CONTACT} */}
      {/*     className="inline-block bg-primary text-white px-6 py-2 rounded hover:bg-primary/80 transition" */}
      {/*   > */}
      {/*     Liên hệ với chúng tôi */}
      {/*   </Link> */}
      {/* </section> */}
    </main>
  );
};
