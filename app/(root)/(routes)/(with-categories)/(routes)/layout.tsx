import Footer from "@/components/footer/Footer";
import Container from "@/components/ui/container";

interface Props {
    children: React.ReactNode;
}

const WithCategoryNav = ({ children, ...props }: Props) => {
    return (
        <div className="space-y-4 pb-28">
            <Container>{children}</Container>

            <Footer fixed />
        </div>
    );
};

export default WithCategoryNav;
