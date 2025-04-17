import Link from "next/link";
import { FaFacebookSquare, FaInstagram, FaTwitter } from "react-icons/fa";

import { PAGES } from "@/components/footer/data";
import Container from "@/components/ui/container";
import LanguageSelector from "@/components/footer/LanguageSelector";
import CurrencySelector from "@/components/footer/CurrencySelector";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { SOCIAL_LINKS, calUrl } from "@/util/constants";

interface Props {
  fixed?: boolean;
}

const Footer = async ({ fixed = false }: Props) => {
  return (
    <footer
      className={cn(
        "bg-background shadow-sm z-10 border-t w-full",
        fixed && "md:fixed md:bottom-0"
      )}
    >
      <Container>
        {/* Desktop View */}
        <div className="hidden flex-col flex-wrap items-center justify-between py-3 sm:flex-row md:flex">
          <div className="flex flex-col flex-wrap items-center justify-between gap-2 text-sm sm:flex-row font-light">
            <p>©️ 2023-24 BrutalyHonest™, In </p>
            <span>·</span>
            <Link target="_blank" className="hover:underline" href={PAGES.TEAM}>
              Team
            </Link>
            <span>·</span>
            <Link className="hover:underline" href={PAGES.TERMS}>
              Terms
            </Link>
            {/* <span>·</span>
          <Link className="hover:underline" href={PAGES.SITEMAP}>
            Sitemap
          </Link> */}
            <span>·</span>
            <Link className="hover:underline" href={PAGES.PRIVACY}>
              Privacy
            </Link>
            <span>·</span>
            <Link className="hover:underline" href={PAGES.COMPANY_DETAILS}>
              Company details
            </Link>
            <span>·</span>
            <Link className="hover:underline" href={PAGES.REFUND}>
              Refund
            </Link>
          </div>
          <div className="flex flex-col flex-wrap items-center justify-between gap-5 text-sm font-semibold sm:flex-row text-secondary">
            <LanguageSelector />

            <CurrencySelector />

            <Link target="_blank" href={SOCIAL_LINKS.FACEBOOK}>
              <FaFacebookSquare size={18} />
            </Link>
            <Link target="_blank" href={SOCIAL_LINKS.TWITTER}>
              <FaTwitter size={18} />
            </Link>
            <Link target="_blank" href={SOCIAL_LINKS.INSTAGRAM}>
              <FaInstagram size={18} />
            </Link>

            <Link target="_blank" href={calUrl} className="text-primary">
              <Button size="sm">Contact Us</Button>
            </Link>
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          <div className="flex items-center my-3 gap-4">
            <LanguageSelector />

            <CurrencySelector />
          </div>

          <div className="pb-4">
            <p className="text-xs pb-1">©️ 2023-24 BrutalyHonest™, In </p>

            <div className="flex items-center gap-2 text-xs">
              <Link
                target="_blank"
                className="hover:underline"
                href={PAGES.TEAM}
              >
                Team
              </Link>
              <span>·</span>

              <Link
                target="_blank"
                className="hover:underline"
                href={PAGES.TERMS}
              >
                Terms
              </Link>

              <span>·</span>
              <Link
                target="_blank"
                className="hover:underline"
                href={PAGES.PRIVACY}
              >
                Privacy
              </Link>
              <span>·</span>
              <Link
                target="_blank"
                className="hover:underline"
                href={PAGES.REFUND}
              >
                Refund
              </Link>

              {/*               <Link
                target="_blank"
                className="hover:underline"
                href={PAGES.COMPANY_DETAILS}
              >
                Company details
              </Link> */}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
