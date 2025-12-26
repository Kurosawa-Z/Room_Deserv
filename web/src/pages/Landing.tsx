import { Button } from "../components/ui/button";
import { PageContainer } from "../components/PageContainer";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <PageContainer className="violet-gradient">
      <div className="min-h-[calc(100dvh-160px)] flex items-center justify-center px-6">
        <section className="text-center max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight app-text-foreground">
            Get your Room Reservation today!
          </h1>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link to="/about">
              <Button className="px-8 py-6 app-text-foreground">Login</Button>
            </Link>
            <Link to="/home">
              <Button
                variant="outline"
                className="px-8 py-6 app-text-foreground"
              >
                Sign up
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
