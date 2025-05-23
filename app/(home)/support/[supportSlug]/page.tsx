import { AVAILABEL_SUPPORT_PAGES } from "@/features/support-pages/support-pages.constants";
import { getSupportPages } from "@/features/support-pages/support-pages.queries";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { AboutUsDefaultPage } from "../_components/about-us-default";
import { ContactDefaultPage } from "../_components/contact-default";

type Params = Promise<{ supportSlug: string }>;

export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { supportSlug } = await params;

  const supportPage = AVAILABEL_SUPPORT_PAGES.find(
    (page) => page.slug === supportSlug,
  );

  return {
    title: supportPage?.title,
    description: supportPage?.description,
    keywords: supportPage?.keywords,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
};

export const generateStaticParams = async () => {
  return AVAILABEL_SUPPORT_PAGES.map((page) => ({
    slug: page.slug,
  }));
};

export const revalidate = 86400;

const defaultPage: Record<string, React.FC> = {
  "about-us": AboutUsDefaultPage,
  contact: ContactDefaultPage,
};

const SupportPage = async ({ params }: { params: Params }) => {
  const { supportSlug } = await params;

  const pageInfo = AVAILABEL_SUPPORT_PAGES.find(
    (page) => page.slug === supportSlug,
  );
  if (!pageInfo) {
    return notFound();
  }
  const supportPageResult = await getSupportPages({ slug: supportSlug });

  if (!supportPageResult.success) {
    if (defaultPage[supportSlug]) {
      const DefaultPage = defaultPage[supportSlug];
      return <DefaultPage />;
    }
    return notFound();
  }

  const supportPage = supportPageResult.data;

  return (
    <div>
      <div
        className="support-container"
        dangerouslySetInnerHTML={{ __html: supportPage.content }}
      />
    </div>
  );
};

export default SupportPage;
