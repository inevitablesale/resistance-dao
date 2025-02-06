
import Image from "@/components/ui/image"
import { cn } from "@/lib/utils"

export const Partners = () => {
  const partners = [
    {
      name: "Canary Accountants",
      logo: "/canary-accountants-logo.png",
      url: "https://canary.accountants/"
    }
  ]

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container px-4">
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-12 text-center">
          Our Partners
        </h2>

        <div className="flex flex-wrap justify-center items-center gap-12">
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-teal-500/20 to-yellow-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-black/30 backdrop-blur p-8 rounded-lg border border-yellow-500/20 group-hover:border-yellow-500/40 transition-all duration-300">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={200}
                  height={80}
                  className={cn(
                    "transition-all duration-300",
                    "filter brightness-90 group-hover:brightness-100"
                  )}
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
