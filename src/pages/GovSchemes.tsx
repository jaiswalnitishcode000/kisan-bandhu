import { govSchemes } from "@/data/advisoryData";
import ScrollReveal from "@/components/ScrollReveal";
import { toast } from "sonner";

const GovSchemes = () => (
  <div className="min-h-screen py-8">
    <div className="container mx-auto px-4">
      <ScrollReveal>
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">🏛️ Government Schemes</h1>
          <p className="text-muted-foreground mt-2">Important farmer welfare schemes by the Government of India</p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {govSchemes.map((scheme, i) => (
          <ScrollReveal key={i}>
            <div className="bg-card rounded-2xl border border-border shadow-card p-6 h-full flex flex-col hover:shadow-kisan transition-shadow">
              <div className="text-4xl mb-3">{scheme.icon}</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{scheme.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{scheme.description}</p>
              
              <div className="space-y-3 text-sm flex-1">
                <div>
                  <span className="font-medium text-foreground">Eligibility:</span>
                  <p className="text-muted-foreground">{scheme.eligibility}</p>
                </div>
                <div>
                  <span className="font-medium text-foreground">Benefits:</span>
                  <p className="text-muted-foreground">{scheme.benefits}</p>
                </div>
              </div>

              <button
                onClick={() => window.open(scheme.link, "_blank")}
                className="mt-4 w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Apply Now →
              </button>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </div>
);

export default GovSchemes;
