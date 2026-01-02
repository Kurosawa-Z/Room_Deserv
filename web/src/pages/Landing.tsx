import { useNavigate } from "react-router-dom"; 
import { Button } from "../components/ui/button";
import { PageContainer } from "../components/pageContainer";
import { Link } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <div className="min-h-[calc(100dvh-160px)] flex items-center justify-center px-6">
        <section className="text-center max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight app-text-foreground">
            Get your Room Reservation today!
          </h1>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button 
              className="px-8 py-6 app-text-foreground"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button
                variant="outline"
                className="px-8 py-6 app-text-foreground"
            >
              Sign up
            </Button>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
