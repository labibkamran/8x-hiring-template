/**
 * How It Works Section Component
 * 
 * Three-step process explanation showing users how simple
 * it is to generate AI videos with Genify.ai.
 */

import { PenLine, SlidersHorizontal, Film } from "lucide-react"

const STEPS = [
  {
    step: 1,
    icon: PenLine,
    title: "Enter Your Prompt",
    description: "Describe your vision in natural language. Be as creative and detailed as you want.",
  },
  {
    step: 2,
    icon: SlidersHorizontal,
    title: "Choose AI Model & Settings",
    description: "Select from cutting-edge models like Sora or Veo. Adjust aspect ratio and quality.",
  },
  {
    step: 3,
    icon: Film,
    title: "Get Cinematic Video",
    description: "Watch AI transform your words into stunning, high-quality video in minutes.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Create professional AI videos in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {STEPS.map((item, index) => (
            <div key={item.step} className="relative text-center">
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>

              {index < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
