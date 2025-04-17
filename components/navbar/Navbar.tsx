import Container from "@/components/ui/container";
import Logo from "@/components/navbar/Logo";
import Search from "@/components/navbar/Search";
import UserMenu from "@/components/navbar/UserMenu";
import getPropertyCount from "@/lib/actions/getPropertyCount";

const Navbar = async () => {
  const { isExistingHost } = await getPropertyCount();

  return (
    <nav className="w-full bg-white">
      <Container className="flex justify-between gap-3 md:gap-0 py-4 items-center">
        <Logo />
        <Search />
        <UserMenu isExistingHost={isExistingHost} />
      </Container>
    </nav>
  );
};

export default Navbar;
