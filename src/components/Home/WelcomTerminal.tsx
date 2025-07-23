import { AnimatedSpan, TypingAnimation } from "../Terminal"

export const WelcomeTerminal = () => (
  <>
    <span>
      <span>$</span>
      <TypingAnimation duration={60}> ./nvd.sh </TypingAnimation>
    </span>

    <AnimatedSpan delay={1800} className="text-green-500">
      <span>✔ Started</span>
    </AnimatedSpan>
  </>
)
