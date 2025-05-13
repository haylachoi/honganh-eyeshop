import {
  ADMIN_ENDPOINTS,
  AVAILABEL_SUPPORT_PAGES,
} from "@/constants/endpoints.constants";
import Link from "next/link";

const availablePages = AVAILABEL_SUPPORT_PAGES;

const SupportPage = () => {
  return (
    <div>
      <ul>
        {availablePages.map((page) => (
          <li key={page.slug}>
            <Link
              className="text-link"
              href={`${ADMIN_ENDPOINTS.SUPPORT.SEGMENT}/${page.slug}/update`}
            >
              {page.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SupportPage;
