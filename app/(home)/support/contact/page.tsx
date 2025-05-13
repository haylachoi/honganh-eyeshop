import { STORE_INFO } from "@/constants";
import { getSupportPages } from "@/features/support-pages/support-pages.queries";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liên hệ | Hồng Anh Eyewear",
  description:
    "Liên hệ với cửa hàng kính mắt Hồng Anh – chúng tôi luôn sẵn sàng hỗ trợ bạn.",
};

const ContactPage = async () => {
  const result = await getSupportPages({
    slug: "contact",
  });
  if (!result.success) {
    return <DefaultContactPage />;
  }

  const pageInfo = result.data;
  return (
    <div>
      <div
        className="support-container"
        dangerouslySetInnerHTML={{ __html: pageInfo.content }}
      />
    </div>
  );
};

export default ContactPage;

const DefaultContactPage = () => {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-6">
        Liên hệ với chúng tôi
      </h1>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-xl font-semibold mb-4">Thông tin liên hệ</h2>

          <div className="mb-2 flex gap-2">
            <span>🏠 Địa chỉ:</span>
            <span className="font-medium">{STORE_INFO.ADDRESS}</span>
          </div>

          <div className="mb-2 flex gap-2">
            <span>📞 Điện thoại:</span>
            <span className="font-medium">{STORE_INFO.PHONE}</span>
          </div>

          <div className="mb-2 flex gap-2">
            <span>✉️ Email:</span>
            <span className="font-medium">{STORE_INFO.EMAIL}</span>
          </div>
        </div>

        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium">
              Họ và tên
            </label>
            <input
              type="text"
              id="name"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block font-medium">
              Nội dung
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90"
          >
            Gửi liên hệ
          </button>
        </form>
      </div>
    </section>
  );
};
