import { getSupportPages } from "@/features/support-pages/support-pages.queries";
import { SupportPageUpdateType } from "@/features/support-pages/support-pages.types";
import { SupportPageFormUpdate } from "../../_components/support-page-form.update";
import { notFound } from "next/navigation";

const availabelPages = [
  {
    slug: "about-us",
    title: "Về chúng tôi",
  },
  {
    slug: "contact",
    title: "Liên hệ với chúng tôi",
  },
];

type Params = {
  supportSlug: string;
};

const SupportPage = async ({ params }: { params: Promise<Params> }) => {
  const { supportSlug } = await params;
  const availablePage = availabelPages.find(
    (page) => page.slug === supportSlug,
  );
  if (!availablePage) {
    return notFound();
  }
  const result = await getSupportPages({ slug: supportSlug });
  const emptyValues: SupportPageUpdateType = {
    title: availablePage.title,
    slug: supportSlug,
    content: "",
    isPublished: true,
    showFooter: true,
    images: [],
    imageSources: [],
    deletedImages: [],
  };

  const defaultValues: SupportPageUpdateType = result.success
    ? {
        ...result.data,

        imageSources: [],
        deletedImages: [],
      }
    : emptyValues;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-12">{availablePage.title}</h1>
      <SupportPageFormUpdate defaultValues={defaultValues} />
    </div>
  );
};

export default SupportPage;
