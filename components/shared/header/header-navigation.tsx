import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/custom-ui/accordion";
import { ENDPOINTS } from "@/constants";
import { cn } from "@/lib/utils";
import { ChevronDown, MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type SubLinkType = {
  title: string;
  links: { title: string; href: string }[];
};

type SubImageLinkType = {
  title: string;
  image: string;
  href: string;
};
type LinkType = {
  title: string;
  contents: (SubLinkType | SubImageLinkType)[];
};
const links: LinkType[] = [
  {
    title: "Kính mắt",
    contents: [
      {
        title: "Mua ngay",
        links: [
          { title: "Kính", href: "/" },
          { title: "Kính nam", href: "/" },
          { title: "Kính nữ", href: "/" },
        ],
      },
      {
        title: "Nổi bật",
        links: [
          { title: "Phổ biến", href: `${ENDPOINTS.MOST_POPULAR}` },
          {
            title: "Giảm giá",
            href: `${ENDPOINTS.ON_SALE}`,
          },
          {
            title: "Sắp về",
            href: `${ENDPOINTS.NEW_ARRIVAL}`,
          },
        ],
      },
      {
        title: "Hướng dẫn",
        links: [{ title: "Mua online", href: `${ENDPOINTS.ORDER_ONLINE}` }],
      },
      {
        title: "Kính rẻ",
        image: "/navigation/cheap-glasses.jpg",
        href: `${ENDPOINTS.CHEAP_GLASSES}`,
      },
    ],
  },
  {
    title: "Kính thuốc",
    contents: [
      {
        title: "Mua ngay",
        links: [
          { title: "Kính", href: "/" },
          { title: "Kính nam", href: "/" },
          { title: "Kính nữ", href: "/" },
        ],
      },
      {
        title: "Nổi bật",
        links: [
          { title: "Phổ biến", href: `${ENDPOINTS.MOST_POPULAR}` },
          {
            title: "Giảm giá",
            href: `${ENDPOINTS.ON_SALE}`,
          },
          {
            title: "Sắp về",
            href: `${ENDPOINTS.NEW_ARRIVAL}`,
          },
        ],
      },
      {
        title: "Hướng dẫn",
        links: [{ title: "Mua online", href: `${ENDPOINTS.ORDER_ONLINE}` }],
      },
    ],
  },
];
export const NavigationMenu = async ({ className }: { className?: string }) => {
  return (
    <nav className={cn("w-full", className)}>
      <Accordion className="w-full lg:flex gap-4">
        {links.map((mainlink) => (
          <AccordionItem
            key={mainlink.title}
            value={mainlink.title}
            className="group"
          >
            <AccordionTrigger className="py-2 flex justify-between items-center gap-2 text-xl font-bold cursor-pointer">
              {mainlink.title}
              <ChevronDown className="size-6 inline-block max-lg:group-data-[accordion-active='true']:rotate-180 transition-all duration-300 lg:group-hover:rotate-180" />
            </AccordionTrigger>
            <AccordionContent className="lg:hidden lg:group-hover:block lg:top-full lg:absolute lg:left-0 lg:w-full lg:bg-background lg:border-b-2 border-b-foreground lg:shadow-sm">
              {/* fake gap */}
              <div className="hidden lg:block w-full h-1 bg-foreground" />
              <ul className="lg:container lg:mx-auto flex flex-col gap-3 bg-background py-2 lg:flex-row justify-between">
                {mainlink.contents.map((content) => {
                  if ("links" in content) {
                    return (
                      <li
                        key={content.title}
                        className="py-1 flex flex-col gap-1"
                      >
                        <h3 className="text-lg font-semibold">
                          {content.title}
                        </h3>
                        <ul>
                          {content.links.map((link) => (
                            <li
                              key={link.title}
                              className="hover:border-b border-b-foreground"
                            >
                              <Link
                                className="inline-block w-full"
                                href={link.href}
                              >
                                {link.title}
                              </Link>{" "}
                            </li>
                          ))}
                        </ul>
                      </li>
                    );
                  }

                  return (
                    <li key={content.title}>
                      <Link href={content.href}>
                        <Image
                          className="w-full h-auto max-h-[200px] object-cover object-center"
                          src={content.image}
                          alt={content.title}
                          width={600}
                          height={200}
                        />
                        <div className="text-lg font-medium flex justify-center items-center gap-4">
                          {content.title}
                          <MoveRight />
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </nav>
  );
};
