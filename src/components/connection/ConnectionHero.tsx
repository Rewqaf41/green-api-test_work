export function ConnectionHero() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-[radial-gradient(circle_at_18%_78%,rgba(132,220,255,.38),transparent_29%),radial-gradient(circle_at_88%_8%,rgba(187,152,255,.55),transparent_35%),linear-gradient(145deg,#3128d7_0%,#5a57f7_48%,#28a8ef_118%)] p-[clamp(40px,5vw,76px)] text-white md:flex">
      <div className="relative z-10 grid bg-white/15 text-3xl font-extrabold tracking-tighter shadow-[0_12px_32px_rgba(23,18,117,.24)] backdrop-blur-sm" />
      <div className="relative z-10 max-w-130">
        <span className="text-[13px] font-extrabold tracking-[.16em] opacity-70">
          GREEN-API
        </span>
        <strong className="my-3 block text-[clamp(42px,5vw,76px)] leading-none font-bold tracking-[-.065em]">
          Чат для MAX / WhatsApp / Telegram
        </strong>
        <p className="mt-5 max-w-110 text-[clamp(16px,1.45vw,21px)] leading-relaxed text-white/75">
          Отправляйте и получайте текстовые сообщения в реальном времени
        </p>
      </div>
    </div>
  )
}
