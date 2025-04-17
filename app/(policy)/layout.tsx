import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/ui/container";

interface Props {
  children: React.ReactNode;
}

const PolicyLayout = ({ children }: Props) => {
  return (
    <>
      <Navbar />

      <Container className="my-28">{children}</Container>

      <Footer fixed />
    </>
  );
};

export default PolicyLayout;
